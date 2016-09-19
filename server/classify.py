import json
import re
import math

from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer

R_ORIGINAL = re.compile('---[-]*\s*original', re.I)
R_FORWARD = re.compile('---[-]*\s*forward', re.I)
R_BOUNDARY = re.compile('--[-]*boundary', re.I)
R_SUBJECT = re.compile('^\s+$(?:.|\n)*^\s*to:(?:.|\n)+^\s*subject:', re.I | re.M)
R_ON_WROTE = re.compile('^On.*[\n\r\s]+<\w+@\w+.\w+>[\n\r\s]+wrote:', re.I | re.M)

R_LIST = [ R_ORIGINAL, R_FORWARD, R_BOUNDARY, R_SUBJECT, R_ON_WROTE ]

NAIVE_BAYES = NaiveBayesAnalyzer()

def extract(orig):
    """Process the text and a possible thread of messages and extract the current message itself."""
    text = orig.strip()
    for r in R_LIST:
        m = r.search(text)
        if m:
            return extract(text[0:m.span()[0]])
    return text

def heuristics(message, debug):
    """Apply heuristics to establish if the classification algorithims have detected something interesting."""
    # With enough high quality traning data, this could be replaced with a regression if we assume this space is linearly separable
    if len(message) < 7:
        return { "flag": False, "reason": "short" } if debug else None
    
    if len(message) > 2200:
        return { "flag": False, "reason": "long" } if debug else None

    pt = TextBlob(message).sentiment
    if pt.subjectivity == 0.0 or pt.polarity == 0.0:
        return { "flag": False, "reason": "zero", "pt": pt } if debug else None

    if pt.subjectivity > 0.8:
        return { "flag": False, "reason": "objective-1", "pt": pt } if debug else None

    nb = None
    
    nb = TextBlob(message, analyzer=NAIVE_BAYES).sentiment
    if math.fabs(nb.p_pos - nb.p_neg) > 0.9:
        if pt.polarity < 0.0: 
            return { "flag": True, "reason": "polar-1" }

        if pt.subjectivity > 0.4:
            return { "flag": False, "reason": "objective-2", "pt": pt, "nb": nb } if debug else None

        if pt.polarity < 0.2: 
            return { "flag": True, "reason": "polar-2" }
    
    return { "flag": False, "reason": "fallthrough", "pt": pt, "nb": nb } if debug else None

def classify(id, jmap, debug):
    str = jmap.decode('utf-8')
    o = json.loads(str)
    message = None
    # print(str.encode("ascii", "replace"))
    if 'textBody' in o:
        message = extract(o['textBody'])
    elif 'strippedHtmlBody' in o:
        message = extract(o['strippedHtmlBody'])
    else:
        return None

    result = heuristics(message, debug)
    if result:
        if debug:
            print("--------------------------------------------------------------------------")
            print(message.encode("ascii", "replace"))
        # return dict(name='statistics', key=id, value=result)
        print("--------------------------------------------------------------------------")
        print(result['reason'])

        augment = dict(list=result, detail=result)
        return dict(name='threads', key=o['threadId'], value=augment)

    return None
    

def compute(req):
    return list(filter(lambda x: x != None, [ classify(d['key'], d['value'], False) for d in req['in']['data'] ]))
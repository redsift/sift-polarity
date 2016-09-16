#!/usr/bin/env python

"""test-classify.py: Computes metadata about an email message."""

from __future__ import print_function
import os, sys

from classify import classify

__author__ = "Rahul Powar"
__copyright__ = "Copyright 2016, Redsift Limited."
__license__ = "MIT"
__version__ = "0.0.1"
__status__ = "Prototype"

def listdir_nodot(p):
    for f in os.listdir(p):
        if not f.startswith('.'):
            yield os.path.join(p, f)

def test(fn):
    f = os.path.basename(fn)
    d = open(fn, 'r').read()
    # Set the ID to the filename for this test
    r = classify(f, d, False)
    print(r)

if len(sys.argv) < 2:
    print("Please supply a file or directory to evaluate", file=sys.stderr)
    exit(1)

for f in sys.argv[1:]:
    if os.path.exists(f) == False:
        print("Path not found:", f, file=sys.stderr)
    elif os.path.isdir(f) == True:
        for fs in listdir_nodot(f):
            test(fs)
    else:
        test(f)
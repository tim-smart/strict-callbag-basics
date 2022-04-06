# strict-callbag-basics

Operators for the callbag streaming standard, on top of the strict-callbag
types.

## Push based streams

Most stream and operators in this library are pull-based.

If a stream creates / produces a push based stream, it will have the `P` suffix.

To convert a push based stream into a pull-based one, you can use the `buffer`
operator.

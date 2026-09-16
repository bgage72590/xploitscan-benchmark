// A hardcoded credential whose VALUE carries no recognisable prefix, so
// VC001's shape regexes (sk_live_, ghp_, AIza…) do not match it. The only
// thing marking it as a secret is the name it is assigned to — which is
// exactly what the entropy scanner's credential-name path is for.
//
// That path was dead. The variable name was extracted with a pattern needing
// a trailing ":" or "=" that the string matcher had already consumed, so it
// was the empty string on every line of every file, `isLikelySecret` was
// permanently false, and the final gate demanded 4.5 bits from everything.
//
// This value measures 4.32 bits — above the 4.0 entry threshold for its
// charset, below the 4.5 final gate. That gap is the whole point: a
// higher-entropy secret is reported either way and the fixture would pass
// without the fix, which is how the sibling clean fixture once passed while
// the bug it documents was still live.

export const apiKey = "a7f3_9k2m_4p8q_1z5x_6c0v_3b7n";

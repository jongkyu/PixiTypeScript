type Action0 = () => void;
type Action1Or0<P1> = (p1?: P1) => void;
type Action1<P1> = (p1: P1) => void;
type Action2<P1, P2> = (p1: P1, p2: P2) => void;
type Action3<P1, P2, P3> = (p1: P1, p2: P2, p3: P3) => void;
type Action4<P1, P2, P3, P4> = (p1: P1, p2: P2, p3: P3, p4: P4) => void;

type Func0<R> = () => R;
type Func1<R, P1> = (p1: P1) => R;
type Func2<R, P1, P2> = (p1: P1, p2: P2) => R;
type Func3<R, P1, P2, P3> = (p1: P1, p2: P2, p3: P3) => R;
type Func4<R, P1, P2, P3, P4> = (p1: P1, p2: P2, p3: P3, p4: P4) => R;


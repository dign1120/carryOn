type Coordinate = {
    lat: number;
    lon: number;
};

type WalkStep = {
    linestring: string;
};

type BusStep = {
    linestring: string;
}

type WalkLeg = {
    mode: "WALK";
    start: Coordinate;
    steps: WalkStep[];
    end: Coordinate;
};

type BusLeg = {
    mode: "BUS";
    start: Coordinate;
    passShape : BusStep;
    end: Coordinate;
};

type Leg = WalkLeg | BusLeg;

export type Route = Leg[];

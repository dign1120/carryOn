export type CctvItem = {
    roadsectionid : string,
    coordx : number,
    coordy : number,
    cctvresolution : string,
    filecreatetime : string,
    cctvtype : string,
    cctvformat : string,
    cctvname : string,
    cctvurl : string
}

export type NearestCctvDto = {
    CCTVID: string;
    CCTVIP: string;
    CH:string;
    XCOORD: number;
    MOVIE: string;
    KIND: string;
    CENTERNAME: string;
    YCOORD: number;
    CCTVNAME: string;
    ID: string;
    STRMID: string;
}
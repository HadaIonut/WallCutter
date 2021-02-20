class WallCutting {

    private static _instance: WallCutting;

    private constructor() {
    }

    public static getInstance(): WallCutting {
        if (!WallCutting._instance) WallCutting._instance = new WallCutting();
        return WallCutting._instance;
    }

    private async _createWallAtCoords(coords: number[], wall: any) {
        // @ts-ignore
        return await Wall.create({
            c: coords,
            flags: wall.data.flags,
            move: wall.data.move,
            sense: wall.data.sense,
            door: wall.data.door,
            ds: wall.data.ds
        })
    }

    private async _createNewWalls(wall: any): Promise<void> {
        const coords = wall.data.c;
        //first has 4 coords, the first 2 are the x and y of the first point while the last 2 are x, y of the center of the segment
        const first = [coords[0], coords[1], Math.floor((coords[0] + coords[2]) / 2), Math.floor((coords[1] + coords[3]) / 2)];
        //second has 4 coords the first 2 are the x and y of the center point of the segment and the last 2 are the x and y of the last point.
        const second = [Math.floor((coords[0] + coords[2]) / 2), Math.floor((coords[1] + coords[3]) / 2), coords[2], coords[3]];

        await this._createWallAtCoords(first, wall);
        await this._createWallAtCoords(second, wall);
    }

    public async cutTheWall(wall: any) {
        await this._createNewWalls(wall);
        wall._object.release();
        await wall.delete();
    }

}

export default WallCutting.getInstance();
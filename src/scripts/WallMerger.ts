class WallMerger {

    private static _instance: WallMerger;

    private constructor() {
    }

    public static getInstance(): WallMerger {
        if (!WallMerger._instance) WallMerger._instance = new WallMerger();
        return WallMerger._instance;
    }

    private _findOverlappingWalls() {
        const walls = canvas.walls.objects.children;
        walls.forEach((wall) => {
            const wallCoords = wall.data.c;

        })
    }

    public mergeWalls(wall: any) {

    }
}

export default WallMerger.getInstance();
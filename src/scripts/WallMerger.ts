class WallMerger {

    private static _instance: WallMerger;

    private constructor() {
    }

    public static getInstance(): WallMerger {
        if (!WallMerger._instance) WallMerger._instance = new WallMerger();
        return WallMerger._instance;
    }

    /**
     * Returns the cos of the angle between 2 walls
     *
     * @param firstWall
     * @param secondWall
     * @private
     */
    private _calculateCosOfAngleBetween2Walls(firstWall, secondWall) {
        const magnitudeProduct = this._calculateWallMagnitude(firstWall) * this._calculateWallMagnitude(secondWall);
        return this._calculateDotProduct(firstWall, secondWall) / magnitudeProduct;
    }

    /**
     * Calculates the magnitude based on a line equation
     *
     * @param wallEquation
     * @private
     */
    private _calculateWallMagnitude(wallEquation: number[]) {
        return Math.sqrt(Math.pow(wallEquation[0], 2) + Math.pow(wallEquation[1], 2))
    }

    /**
     * Calculates the dot product between 2 walls
     *
     * @param firstWall
     * @param secondWall
     * @private
     */
    private _calculateDotProduct(firstWall: number[], secondWall: number[]): number {
        return firstWall[0] * secondWall[0] + firstWall[1] * secondWall[1];
    }

    /**
     * returns the line's equation based on coords
     * @example ai + bj = 0 => [a,b]
     *
     * @param wallCoords
     * @private
     */
    private _makeWallEquation(wallCoords: number[]): number[] {
        return [wallCoords[2] - wallCoords[0], wallCoords[3] - wallCoords[1]]
    }

    /**
     * Part 2 of the calculation I stole from stackOverFlow that I do not really understand
     *
     * @param A - first point coords
     * @param B - second point coords
     * @param C - third point coords
     * @private
     */
    private ccw(A: number[], B: number[], C: number[]): boolean {
        return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0])
    }

    /**
     * Some function that checks intersection of 2 lines I stole from stackOverFlow, I have no idea how it works
     *
     * @param firstWall - coords of the first wall
     * @param secondWall- coords of the second wall
     * @private
     */
    private _checkIntersection(firstWall: number[], secondWall: number[]): boolean {
        const A = [firstWall[0], firstWall[1]];
        const B = [firstWall[2], firstWall[3]];
        const C = [secondWall[0], secondWall[1]];
        const D = [secondWall[2], secondWall[3]];
        return this.ccw(A, C, D) != this.ccw(B, C, D) && this.ccw(A, B, C) != this.ccw(A, B, D)
    }

    private _shouldIMerge(mainWall: any, currentWall: any): boolean {
        const linkedSegments = mainWall.getLinkedSegments().walls;
        for (const segment of linkedSegments) {
            if (segment === currentWall) return false;
        }
        return true;
    }

    private _mergeWalls(mainWall: any, targetWall: any) {

    }

    private _findOverlappingWalls(mainWallCoords: any, mainWall) {
        const walls = canvas.walls.objects.children;
        const mainWallEquation = this._makeWallEquation(mainWallCoords);

        walls.forEach((wall) => {
            if (!this._shouldIMerge(mainWall, wall)) return;
            const wallCoords = wall.data.c;
            const wallEquation = this._makeWallEquation(wallCoords);
            const angleBetweenWalls = Math.acos(this._calculateCosOfAngleBetween2Walls(mainWallEquation, wallEquation))
            if (this._checkIntersection(mainWallCoords, wallCoords)) console.log(angleBetweenWalls);
        })
    }

    public mergeWalls(wall: any) {
        this._findOverlappingWalls(wall.data.c, wall);
    }
}

export default WallMerger.getInstance();
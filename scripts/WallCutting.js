const _createWallAtCoords = async (coords, wall) => {
    return await wall.parent.createEmbeddedDocuments('Wall', [{
        c: coords,
        flags: wall.data.flags,
        move: wall.data.move,
        sense: wall.data.sense,
        door: wall.data.door,
        ds: wall.data.ds
    }])
}

const _createNewWalls = async (wall) => {
    const coords = wall.data.c;
    //first has 4 coords, the first 2 are the x and y of the first point while the last 2 are x, y of the center of the segment
    const first = [coords[0], coords[1], Math.floor((coords[0] + coords[2]) / 2), Math.floor((coords[1] + coords[3]) / 2)];
    //second has 4 coords the first 2 are the x and y of the center point of the segment and the last 2 are the x and y of the last point.
    const second = [Math.floor((coords[0] + coords[2]) / 2), Math.floor((coords[1] + coords[3]) / 2), coords[2], coords[3]];

    await _createWallAtCoords(first, wall);
    await _createWallAtCoords(second, wall);
}

const cutTheWall = async (wall) => {
    await _createNewWalls(wall);
    wall._object.release();
    await wall.delete();
}


export {cutTheWall}
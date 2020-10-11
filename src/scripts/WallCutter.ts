Hooks.on("renderWallConfig", (data, html) => {
    console.log(data);
    if (!game.user.isGM) return;

    let button = $("<button class='import-markdown'><i class='fas fa-file-import'></i>Cut The Wall</button>");
    button.on('click', () => {
        const coords = data.object.data.c;
        const first = [coords[0], coords[1], Math.floor((coords[0] + coords[2]) / 2), Math.floor((coords[1] + coords[3]) / 2)];
        const second = [Math.floor((coords[0] + coords[2]) / 2), Math.floor((coords[1] + coords[3]) / 2), coords[2], coords[3]];
        // @ts-ignore
        Wall.create({
            c: first,
            flags: data.object.data.flags,
            move: data.object.data.move,
            sense: data.object.data.sense,
            door: data.object.data.door,
            ds: data.object.data.ds
        })
        // @ts-ignore
        Wall.create({
            c: second,
            flags: data.object.data.flags,
            move: data.object.data.move,
            sense: data.object.data.sense,
            door: data.object.data.door,
            ds: data.object.data.ds
        })
        data.object.release();
        data.object.destroy();
        data.close();
    });

    html.find(".window-content").append(button)
})

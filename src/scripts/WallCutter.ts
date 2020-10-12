import WallCutting from "./WallCutting";

Hooks.on("renderWallConfig", (data, html) => {
    console.log(data);
    if (!game.user.isGM) return;

    let cutButton = $("<button class='import-markdown'><i class='fas fa-file-import'></i>Cut The Wall</button>");
    cutButton.on('click', () => {
        WallCutting.cutTheWall(data.object);
        data.close();
    });

    let mergeButton = $("<button class='import-markdown'><i class='fas fa-file-import'></i>Merge overlapping walls</button>");
    mergeButton.on('click', () => {

    })
    html.find(".window-content").append(cutButton)
})



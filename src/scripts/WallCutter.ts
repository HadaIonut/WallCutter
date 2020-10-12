import WallCutting from "./WallCutting";
import WallMerger from "./WallMerger";

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
        WallMerger.mergeWalls(data.object);
    })
    html.find(".window-content").append(cutButton);
    html.find(".window-content").append(mergeButton);
})

Hooks.on("getSceneControlButtons", (controls) => {
    if (!game.user.isGM) return;
    const insertTool = {
        name: "insertTool",
        title: "Insert into walls",
        icon: "fas fa-pen",
    }
    controls[4].tools.push(insertTool);
})

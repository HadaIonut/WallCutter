import WallCutting from "./WallCutting";
import WallMerger from "./WallMerger";

Hooks.on("renderWallConfig", (data, $html) => {
    if (!game.user.isGM) return;

    let cutButton = $("<button><i class='fas fa-cut'></i>Cut The Wall</button>");
    cutButton.on('click', async () => {
        await WallCutting.cutTheWall(data.object);
        data.close();
    });

    let mergeButton = $("<button><i class='fas fa-code-branch'></i>Merge overlapping walls</button>");
    mergeButton.on('click', async () => {
        await WallMerger.mergeWalls(data.object);
        data.close();
    })

    const location = $html.find(".window-content").children();
    location.append(cutButton);
    location.append(mergeButton);

    $html.css({height:350});
    data.setPosition({height:350});
})

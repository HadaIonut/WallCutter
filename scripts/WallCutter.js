import {cutTheWall} from "./WallCutting.js";
import {mergeAllSelectedWalls, mergeWalls} from "./WallMerger.js";

Hooks.on("getSceneControlButtons", (controls) => {
    const mergeSelected = {
        name: "mergeSelected",
        title: "Merge Selected",
        icon: "fas fa-code-branch",
        onClick: () => mergeAllSelectedWalls(),
        button: true
    }
    controls[4].tools.splice(7, 0, mergeSelected);
})

Hooks.on("renderWallConfig", (data, $html) => {
    if (!game.user.isGM) return;

    let cutButton = $("<button><i class='fas fa-cut'></i>Cut the wall</button>");
    cutButton.on('click', async () => {
        await cutTheWall(data.object);
        data.close();
    });

    let mergeButton = $("<button><i class='fas fa-code-branch'></i>Merge overlapping walls</button>");
    mergeButton.on('click', async () => {
        await mergeWalls(data.object);
        data.close();
    })

    const location = $html.find(".window-content").children();

    const form = $("<div class='form-group'></div>");
    location.append(form);
    form.append(cutButton);
    form.append(mergeButton);

    $html.css({height: 322});
    data.setPosition({height: 322});
})

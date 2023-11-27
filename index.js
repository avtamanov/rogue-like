const TILE_EDGE = 50;
const SCALE_LEFT = 0.512;
const SCALE_TOP = 0.533;

var TileType = {
  Empty: "",
  EmptyNear: "-",
  Wall: "w",
  Enemy: "e",
  Player: "p",
  HealPotion: "hp",
  SwordPotion: "sw",
};

function getClassNameByTileType(tileType) {
  switch (tileType) {
    case "":
      return "tile";
    case "-":
      return "tileW";
    case "w":
      return "tileW";
    case "e":
      return "tileE";
    case "p":
      return "tileP";
    case "hp":
      return "tileHP";
    case "sw":
      return "tileSW";
  }
}

class Game {
  constructor() {
    this.maxWidth = 40;
    this.maxHeight = 24;

    this.field = [];
    for (var y = 0; y < this.maxHeight; y++) {
      var row = [];
      for (var x = 0; x < this.maxWidth; x++) {
        row.push("w");
      }
      this.field.push(row);
    }

    this.rooms = []; // x,y,w,h, b - (boolean) is connected
  }

  // add tile to field div element
  drawTile(className, x, y) {
    var element = document.createElement("div");
    element.className = getClassNameByTileType(className);
    if (className !== TileType.Empty) {
      element.style.position = "absolute";
      element.style.backgroundSize = "100%";
    }
    element.style.width = SCALE_LEFT * 50 + "px";
    element.style.height = SCALE_TOP * 50 + "px";
    element.style.left = SCALE_LEFT * x * TILE_EDGE + "px";
    element.style.top = SCALE_TOP * y * TILE_EDGE + "px";

    var field = document.getElementsByClassName("field")[0];

    field.appendChild(element);
  }

  // draw all actual tiles
  draw() {
    var field = this.field;
    console.log(field[0].length, field.length);
    console.log(field);
    for (var x = 0; x < field[0].length; x++) {
      for (var y = 0; y < field.length; y++) {
        this.drawTile(field[y][x], x, y);
      }
    }
  }

  // check info for room
  checkRoomPlace(field, x, y, width, height) {
    for (var w = x; w < width; w++) {
      for (var h = y; h < height; h++) {
        if (
          field[h][w] === TileType.Empty ||
          field[h][w] === TileType.HealPotion
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // set info of room
  createRoom(field, x, y, w, h) {
    console.log("createRoom");
    if (field) {
      var width = w + x;
      var height = h + y;
      if (!this.checkRoomPlace(field, x, y, width, height)) {
        return false;
      }
      for (var w = x - 1; w < width + 1; w++) {
        for (var h = y - 1; h < height + 1; h++) {
          if (w >= 0 && w < this.maxWidth && h >= 0 && h < this.maxHeight) {
            // in field shape
            if (w < x || w === width) {
              // fill Near width
              field[h][w] = TileType.HealPotion;
            } else if (h < y || h === height) {
              // fill Near height
              field[h][w] = TileType.HealPotion;
            } else {
              field[h][w] = TileType.Empty;
            }
          }
        }
      }
      this.rooms.push([x, y, width, height, false]);
      return true;
    }
  }

  // add all needed rooms
  randomRooms(field) {
    if (field) {
      var roomsNumber = Math.round(5 * Math.random() + 5); // 5-10
      for (var rN = 0; rN < roomsNumber; rN++) {
        var roomWidth = Math.round(5 * Math.random() + 3); // 3-8
        var roomHeight = Math.round(5 * Math.random() + 3); // 3-8
        var pointX = Math.round((this.maxWidth - roomWidth) * Math.random());
        var pointY = Math.round((this.maxHeight - roomHeight) * Math.random());
        if (!this.createRoom(field, pointX, pointY, roomWidth, roomHeight)) {
          rN--;
        }
      }
      console.log(this.rooms);
    }
  }

  init() {
    // add rooms
    this.randomRooms(this.field);

    // draw all tiles of cur state
    this.draw();
  }
}

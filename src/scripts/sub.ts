import * as PIXI from "pixi.js";

export class Sub extends PIXI.Container {
    constructor() {
        super();
    }

    public init() {
        console.log("Sub");
    }

    protected setup() {
        console.log("Setup");
    }

    public isType(): string {
        return "types"
    }

}


export class SubCar extends Sub {

    private sprite: PIXI.Sprite;
    public init() {
        super.init();
        console.log("SubCar Override");

        //static loader rule
        PIXI.loader
            .add("images/mon.png")
            .load(() => {
                this.setup();
            });
    }

    protected setup() {
        console.log("Sub Setup");
        let mon: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources["images/mon.png"].texture);
        mon.x = 100;
        this.addChild(mon);
    }

    public isType():string{
        return "Car";
    }

}


export class SubHot extends Sub {

    private sprite: PIXI.Sprite;
    private loader: PIXI.loaders.Loader;

    public init() {
        super.init();
        console.log("SubHot Override");

        this.loader = new PIXI.loaders.Loader();
        this.loader.add("images/lobby/icon_04.png").load(() => {
            this.setup();
        })

    }

    protected setup() {
        console.log("Sub Setup");
        console.log(this.loader);
        let mon: PIXI.Sprite = new PIXI.Sprite(this.loader.resources["images/lobby/icon_04.png"].texture);
        mon.x = 0;
        this.addChild(mon);
    }

    public isType():string{
        return "Hot";
    }


}

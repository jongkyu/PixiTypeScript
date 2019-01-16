
import * as PIXI from "pixi.js";
import { SubCar,SubHot } from './sub';
export class Main {

    private app: PIXI.Application;
    private containerCar: SubCar;
    private containerHot: SubHot;
    constructor() {
        console.log("Main Init");
        this.init();
    }

    init() {
        this.app = new PIXI.Application({
            width: 1000,
            height: 1000,
            antialias: true,
            transparent: false,
            resolution: 1
        }
        );

        document.body.appendChild(this.app.view);

        console.log("init");
        console.log(this.app);

        PIXI.loader
            .add("images/cat.png")
            .load(() => {
                this.setup();
            });

        this.app.ticker.add((deltaTime: number) => {
            this.update(deltaTime);
        })

    }

    private update(deltaTime: number) {
        if(this.containerCar) this.containerCar.rotation += 0.01;
    }


    private setup() {
        console.log("setups");
        console.log(this.app);
        //Create the cat sprite
        let cat: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources["images/cat.png"].texture);
        cat.x = 100;
        //Add the cat to the stage
        this.app.stage.addChild(cat);


        this.containerCar = new SubCar();
        this.containerCar.init();
        this.containerCar.x = 300;
        this.containerCar.y = 400;
        this.app.stage.addChild(this.containerCar);

        this.containerHot = new SubHot();
        this.containerHot.init();
        this.containerHot.x = 0;
        this.containerHot.y = 400;
        this.app.stage.addChild(this.containerHot);

    }





}

let main = new Main();
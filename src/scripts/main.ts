
import * as PIXI from "pixi.js";
import 'pixi-spine';

import { Sub, SubCar, SubHot } from './sub';
import { CoroutineManager, WaitForSeconds } from './CoroutineManager';
import { Util } from "./Util";

export class Main {

    private app: PIXI.Application;
    private containerCar: SubCar;
    private containerHot: SubHot;

    private platformType: string = "Car";

    private dragon: PIXI.spine.Spine;
    constructor() {
        console.log("Main Init");
        this.init();
    }

    init() {
        this.app = new PIXI.Application({
            width: 846,
            height: 412,
            antialias: true,
            transparent: false,
            resolution: 1
        }
        );

        this.initCoroutine();
        this.initTextField();

        document.body.appendChild(this.app.view);

        console.log("init");
        console.log(this.app);

        // 일반 이미지 로드 
        let loader1 = new PIXI.loaders.Loader();
        loader1.add("images/cat.png").load((loader: any, res: any) => {
            this.setup(loader, res);
        })

        let loader2 = new PIXI.loaders.Loader();
        loader2.add('power_shoot', 'images/spine/power_shoot.json').load((loader: any, res: any) => {
            this.onAssetsLoaded(loader, res);
        })
                
     
    
        this.app.ticker.add((deltaTime: number) => {
            this.update(deltaTime);
        })

    }

    public onAssetsLoaded(loader: PIXI.loaders.Loader, res: any) {


        console.log(res);
        this.dragon = new PIXI.spine.Spine(res.power_shoot.spineData);
        this.dragon.skeleton.setToSetupPose();
        this.dragon.update(0);
        this.dragon.autoUpdate = false;

        // create a container for the spine animation and add the animation to it
        var dragonCage = new PIXI.Container();
        dragonCage.addChild(this.dragon);

        // measure the spine animation and position it inside its container to align it to the origin
        var localRect = this.dragon.getLocalBounds();
        this.dragon.position.set(-localRect.x, -localRect.y);

        // now we can scale, position and rotate the container as any other display object
        var scale = Math.min(
            (this.app.screen.width * 0.7) / dragonCage.width,
            (this.app.screen.height * 0.7) / dragonCage.height
        );
        dragonCage.scale.set(scale, scale);
        dragonCage.position.set(
            (this.app.screen.width - dragonCage.width) * 0.5,
            (this.app.screen.height - dragonCage.height) * 0.5
        );

        // add the container to the stage
        this.app.stage.addChild(dragonCage);

        // once position and scaled, set the animation to play
        this.dragon.state.setAnimation(0, 'play_02', true);

        //this.app.start();
    }

    private initCoroutine() {
        this.app.ticker.add((deltaTime: number) => {
            CoroutineManager.instance.lateUpdate();
        })
    }

    private update(deltaTime: number) {
        if (this.containerCar) this.containerCar.rotation += 0.01;

        if (this.dragon) this.dragon.update(0.016);
    }


    private async setup(loader: PIXI.loaders.Loader, res: any) {
        console.log("setups");
        console.log(this.app);
        console.log(res);
        //Create the cat sprite
        let cat: PIXI.Sprite = new PIXI.Sprite(res["images/cat.png"].texture);
        cat.x = 100;
        //Add the cat to the stage
        this.app.stage.addChild(cat);


        this.containerCar = new SubCar();
        this.containerCar.x = 300;
        this.containerCar.y = 400;
        this.app.stage.addChild(this.containerCar);

        this.containerHot = new SubHot();
        //this.containerHot.init();
        this.containerHot.x = 0;
        this.containerHot.y = 400;
        this.app.stage.addChild(this.containerHot);


        //type morp test
        let platform: Sub;

        if (this.platformType === "Car") {
            platform = this.containerCar;
        } else {
            platform = this.containerHot;
        }
        platform.init();
        console.log("type : " + platform.isType());




        //async test
        this.asyncTest();


        //CoroutineManager
        let coroutine = CoroutineManager.startCoroutine(this.coroutineClock(), null);
        await coroutine.getDonePromise();
        console.log("wait coroutine");
    }


    *coroutineClock() {

        for (let index = 0; index < 5; index++) {
            yield new WaitForSeconds(1);
            console.log("time : " + index);
        }
    }


    async asyncTest() {
        let result1: Promise<any> = await this.delay3("a", 1000);
        let result2: Promise<any> = await this.delay3(result1 + "b", 500);
        let result3: Promise<any> = await this.delay3(result2 + "c", 100);
    }

    delay3(msg: string, ms: number): Promise<any> {
        return new Promise<any>(function (resolve: any) {
            setTimeout(function () {
                resolve(msg);
            }, ms);
        }).then(function (v: string) {
            console.log(v + " " + ms + "ms");
            return v;
        });
    }


    initTextField() {
        var style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        });

        let windowOuterWidth = window.innerWidth;
        let windowOuterHeight = window.innerHeight;
        var richText = new PIXI.Text(windowOuterWidth + " = " + windowOuterHeight, style);
        richText.x = 0;
        richText.y = 0;

        this.app.stage.addChild(richText);
    }
}

let coroutineManager = new CoroutineManager();
let main = new Main();
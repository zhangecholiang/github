<script setup lang="ts">
    import AMapLoader from "@amap/amap-jsapi-loader";
    import {ref, onMounted, onBeforeUnmount} from "vue";

    // 点标记列表
    let allMarkerList: any = ref([]);
    let displayedMarkerList: any = ref([])
    let overlayGroup: any = null
    let car: any = null
    let AMapObj: any = null;
    let amap: any = null;
    const checkList: any = ref([])
    const lineArr: any = [
        [116.478935, 39.997761],
        [116.478939, 39.997825],
        [116.478912, 39.998549],
        [116.478912, 39.998549],
        [116.478998, 39.998555],
        [116.478998, 39.998555],
        [116.479282, 39.99856],
        [116.479658, 39.998528],
        [116.480151, 39.998453],
        [116.480784, 39.998302],
        [116.480784, 39.998302],
        [116.481149, 39.998184],
        [116.481573, 39.997997],
        [116.481863, 39.997846],
        [116.482072, 39.997718],
        [116.482362, 39.997718],
        [116.483633, 39.998935],
        [116.48367, 39.998968],
        [116.484648, 39.999861]
    ]
    const lineArr2: any = [
        [116.478084, 39.997761],
        [116.478057, 39.997825],
        [116.478952, 39.998549],
        [116.478952, 39.998549],
        [116.478958, 39.998555],
        [116.478958, 39.998555],
        [116.479252, 39.99856],
        [116.479658, 39.998528],
        [116.480151, 39.998453],
        [116.480754, 39.998302],
        [116.480754, 39.998302],
        [116.484868, 39.999861]
    ]
    let car1 = lineArr.shift()
    const car2 = lineArr2.shift()

    async function getMapData() {
        const data = [
            {qymc: '垃圾分类投放点-二号点', fl: '垃圾分类投放点', x: '116.48367', y: '39.998968', cate: 7},
        ]
        allMarkerList.value = data;
        displayedMarkerList.value = data;
        initMap();
    }

    //进行地图初始化
    function initMap() {
        AMapLoader.load({
            key: "1649665e50e99fc625dfe9b9f4982199",
            version: "1.4.15",
        })
            .then((AMap) => {
                AMapObj = AMap
                amap = new AMap.Map("container", {
                    viewMode: "3D", //是否为3D地图模式
                    zoom: 17.5, //初始化地图级别
                    center: [116.478935, 39.997761], //初始化地图中心点位置
                    mapStyle: "amap://styles/9113860e78b64661f33b450d4f1e1d50",
                });
                drawMarker(AMap, displayedMarkerList.value)
                caricon(AMap, displayedMarkerList.value)
                polyline(AMap, displayedMarkerList.value)
            })
            .catch((e) => {
                console.log(e);
            });
    }

    // 小车标记
    let cars = [
        car1,
        car2
    ]
    let cararr = []

    function caricon(AMap: any, arr: any) {
        cars.forEach(i => {
            car = new AMap.Marker({
                position: i,
                icon: "https://webapi.amap.com/images/car.png",
                // icon: new AMap.Icon({
                //     image: "https://webapi.amap.com/images/car.png",
                //     size: new AMap.Size(112, 128),  //图标所处区域大小
                //     imageSize: new AMap.Size(100,128), //图标大小
                // }),
                offset: new AMap.Pixel(-26, -15),
                autoRotation: true,
                angle: -90,
            });
            amap.add(car);
            cararr.push(car)
        })
    }

    // 绘制轨迹
    let arr2 = [
        lineArr,
        lineArr2
    ]

    function polyline(AMap: any, arr: any) {
        arr2.forEach(i => {
            let polyline = new AMap.Polyline({
                path: i,
                showDir: true,
                strokeColor: "#28F", //线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 6 //线宽
                // strokeStyle: "solid"  //线样式
            });
            amap.add(polyline)
        })
        let passedPolyline = new AMap.Polyline({
            // path: this.lineArr,
            strokeColor: "#AF5", //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6 //线宽
            // strokeStyle: "solid"  //线样式
        });
        amap.add(passedPolyline)
        // cararr.forEach(i => {
        car.on("moving", function (e) {
            passedPolyline.setPath(e.passedPath);
        });
        // })
        amap.setFitView();
    }

    // 绘制点标记
    function drawMarker(AMap: any, arr: any) {
        let list: any = [];
        arr.forEach(item => {
            const markericon: any = new AMap.Marker({
                position: [item.x, item.y],
                extData: {
                    index: 1
                },
                title: item.qymc,
                icon: `http://223.113.245.234:8001/dpsp/assets/dadian/${item.qymc}.png`,
                // offset: new AMap.Pixel(-50, -15),
            });
            markericon.on('click', (e) => {
                console.log(markericon.getExtData())
                centerDialogVisible.value = true
            })
            list.push(markericon);
        })
        overlayGroup = new AMap.OverlayGroup(list);
        amap.add(overlayGroup);
    }

    onMounted(() => {
        getMapData()
    });
    const startAnimation = () => {
        cararr.forEach((i, d) => {
            i.moveAlong(arr2[d], 300);
        })
    }
    const pauseAnimation = () => {
        car.pauseMove();
    }
    const resumeAnimation = () => {
        car.resumeMove();
    }
    const stopAnimation = () => {
        car.stopMove();
    }
    const centerDialogVisible = ref(false)
</script>

<template>
    <div id="container"></div>
    <div className="input-card">
        <h4>轨迹回放控制</h4>
        <div className="input-item">
            <input type="button" className="btn" value="开始动画" id="start" @click="startAnimation()"/>
            <input type="button" className="btn" value="暂停动画" id="pause" @click="pauseAnimation()"/>
        </div>
        <div className="input-item">
            <input type="button" className="btn" value="继续动画" id="resume" @click="resumeAnimation()"/>
            <input type="button" className="btn" value="停止动画" id="stop" @click="stopAnimation()"/>
        </div>
    </div>
    <el-dialog
            v-model="centerDialogVisible"
            title="Warning"
            width="30%"
            align-center>
        <span>Open the dialog from the center from the screen</span>
        <template #footer>
      <span class="dialog-footer">
<!--          Confirm-->
      </span>
        </template>
    </el-dialog>
</template>

<style scoped lang="less">
  @import url('https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css');

  #container {
    height: 100%;
    width: 100%;
  }

  .input-card .btn {
    margin-right: 1.2rem;
    width: 9rem;
  }

  .input-card .btn:last-child {
    margin-right: 0;
  }
</style>

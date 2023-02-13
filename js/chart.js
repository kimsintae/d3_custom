let ChartContainers = new Map();

class StyleHandler{

}


class Pie{
    constructor(id,options){
        this.id = id;
        this.dataset;//가공된 dataset을 제공 받는다.
        this.options = options;
        this.svg
        this.xScale;
        this.yScale;
        this.w;
        this.h;
    }
    
    getSvg(){
        if(this.svg == null){console.error("svg object is null")}
        return this.svg;
    }

    draw(){
        const MARGIN = this.options.MARGIN;

        //차트 Y축 높이 조정
        const CHART_Y_HEIGHT =60;
        //차트 X축 너비 조정
        const CHART_X_WIDTH = 50;
        const width = document.getElementById(this.id).parentNode.offsetWidth;
        const height = document.getElementById(this.id).parentNode.offsetHeight;
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        this.svg = d3.select("#"+this.id)
        .attr("width",width)
        .attr("height",height);

        this.w = this.svg.attr("width")-MARGIN.LEFT;
        this.h = this.svg.attr("height");

        const svgDimensions = {
            width: this.w,
            height: this.h,
          };
          const radius = Math.min(svgDimensions.width-MARGIN.LEFT, svgDimensions.height) / 2;
          const data = [420, 80, 130, 210, 510, 80];
    
          const svg = d3
            .select("#myChart4")
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid rgba(0,0,0,0.1)");
    
          const g = svg
            .append("g")
            .attr(
              "transform",
              `translate(${svgDimensions.width / 2}, ${svgDimensions.height / 2})`
            );

          const color = d3.scaleOrdinal([
            "#ff9800",
            "#ffa726",
            "#ffb74d",
            "#ffcc80",
            "#ffe0b2",
            "#fff3e0",
          ]);
    
          const pie = d3.pie();
          const arc = d3.arc().innerRadius(100).outerRadius(radius);
          const arcs = g
            .selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc")
            // .on("mouseover", onMouseOver)
            // .on("mouseout", onMouseOut);
    
          arcs
            .append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc);
    
          arcs
            .append("text")
            .attr("transform", (d) => `translate(${arc.centroid(d)})`)
            .text((d) => d.value)
            .attr("font-family", "sans-serif")
            .attr("font-size", "18px")
            .attr("font-weight", "bold")
            .attr("fill", "#fff")
            .attr("text-anchor", "middle")
            .attr("display", "none");
    
        console.info('Chart frame is successed !');
        return this.svg;
    }
    
}

class Bar{
    constructor(id,options){
        this.id = id;
        this.dataset;//가공된 dataset을 제공 받는다.
        this.options = options;
        this.svg;
        this.xScale;
        this.yScale;
        this.w;
        this.h;
        this.create;
    };

    getDomain(){
        return this.options.domainXY;
    }
    getSvg(){
        if(this.svg == null){console.error("svg object is null")}
        return this.svg;
    };

    getXscale(){return this.xScale;};

    getYscale(){return this.yScale;};
    
    draw(dataset){
        // console.log(this.id," bar drawing... ");
        const MARGIN = this.options.MARGIN;
        //차트 Y축 높이 조정
        const CHART_Y_HEIGHT =60;
        //차트 X축 너비 조정
        const CHART_X_WIDTH = 50;
        const width = document.getElementById(this.id).parentNode.offsetWidth;
        const height = document.getElementById(this.id).parentNode.offsetHeight;
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        this.svg = d3.select("#"+this.id)
                     .attr("width",width)
                     .attr("height",height);
        
        this.w = this.svg.attr("width")-MARGIN.LEFT;
        this.h = this.svg.attr("height");

        //x 스케일 생성
        this.xScale = d3.scaleBand().range([0,this.w-CHART_X_WIDTH]).padding(0.5);
        this.yScale = d3.scaleLinear().range([this.h,CHART_Y_HEIGHT]);

        // // x 축 도메인 구성
        this.xScale.domain(dataset.map(function(d){return d[domainX]}));

        // y 축 도메인 구성
        this.yScale.domain([0, d3.max(dataset,function(d){return d[domainY];})]);
        
        this.svg.selectAll("g").remove();
        this.svg.selectAll("rect")
            .data(dataset)
            .join("rect")
            .attr("class",this.id+"_bar")
            .attr("x",(d)=>this.xScale(d[domainX])+MARGIN.LEFT)
            .transition()
            .duration(800)
            .attr("width",this.xScale.bandwidth())
            .attr("y",(d)=>this.yScale(d[domainY])-MARGIN.BOTTOM)
            .attr("height",(d) => this.h-this.yScale(d[domainY]));

        // x 축 생성
        this.svg.append("g")
            .attr("class","xAxis")
            .attr("transform", "translate("+MARGIN.LEFT+"," + (this.h-MARGIN.BOTTOM) + ")")
            .call(d3.axisBottom(this.xScale));

        // y 축 생성
        this.svg.append("g")
            .attr("class","yAxis")
            .attr("transform", "translate("+MARGIN.LEFT+","+(-MARGIN.BOTTOM)+")")
            .transition()
            .duration(800)
            .call(d3.axisLeft(this.yScale).ticks(10))
        console.info('Chart frame is successed !');
        return this.svg;
    }
}

class Line{
    constructor(id,options){
        this.id = id;
        this.dataset;//가공된 dataset을 제공 받는다.
        this.options = options;
        this.svg
        this.xScale;
        this.yScale;
        this.w;
        this.h;
        this.valueline;
    }

    getSvg(){
        if(this.svg == null){console.error("svg object is null")}
        return this.svg;
    }

   draw(dataset){
        const MARGIN = this.options.MARGIN;

        //차트 Y축 높이 조정
        const CHART_Y_HEIGHT =60;
        
        //차트 X축 너비 조정
        const CHART_X_WIDTH = 50;

        const width = document.getElementById(this.id).parentNode.offsetWidth;
        const height = document.getElementById(this.id).parentNode.offsetHeight;
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        this.svg = d3.select("#"+this.id)
                        .attr("width",width)
                        .attr("height",height);
        
        this.w = this.svg.attr("width")-MARGIN.LEFT;
        this.h = this.svg.attr("height");
        //x 스케일 생성
        let xScale = d3.scaleBand().range([0,this.w-CHART_X_WIDTH]).padding(0.5);
        let yScale = d3.scaleLinear().range([this.h,CHART_Y_HEIGHT+MARGIN.TOP]);
        
        // 라인 생성
        this.valueline = d3.line()
            .x(function(d) { return xScale(d[domainX])+MARGIN.LEFT; })
            .y(function(d) { return yScale(d[domainY]); })
            .curve(d3.curveBasis);

        // x 축 도메인 구성
        xScale.domain(dataset.map(function(d){return d[domainX]}));

        // y 축 도메인 구성
        yScale.domain([0, d3.max(dataset,function(d){return d[domainY];})]);
        console.log(d3.max(dataset,function(d){return d[domainY];}));
        // 라인 생성
        this.svg.selectAll("g").remove();
        this.svg.selectAll("path")
        .data([dataset])
        .join("path")
        .transition()
        .duration(800)
        .attr("class",this.id+"_line")
        .attr("d", this.valueline)

        // x 축 생성
        this.svg.append("g")
                .attr("transform", "translate("+MARGIN.LEFT+"," + (this.h-MARGIN.BOTTOM) + ")")
                .call(d3.axisBottom(xScale));

        // y 축 생성
        this.svg.append("g")
                .attr("transform", "translate("+MARGIN.LEFT+","+(-MARGIN.BOTTOM)+")")
                .transition()
                .duration(800)
                .style("font-size","13px")
                .call(d3.axisLeft(yScale).ticks(10));
;
        console.info('Chart frame is successed !');
        return this.svg;
   }
}

class Table{
    
}
/*
    1. 스타일적용에 대한 디자인구성 필요
    2. 항상 부모요소의 크기와 위치를 따를것.
    3. 차트 생성에 관한 책임은 차트객체로 전달
    4. DATA 핸들링은 클라이언트에서 수행 ( 클라이언트는 차트 생성 호출만 하면 될 수 있도록 )
    5. 옵션(축,폰트,색상 등등)의 대한 디자인 구성 필요
    

    * 추가 디자인 사항
    - 툴팁이 옵션으로 가능하여야 한다.
    - svg에 다중 차트레이어가 적용 되어야 한다.
    - svg 상태 update가 되어야 한다.
*/
class syD3 {
    //차트 객체와 연결하기 위한 객체
    constructor(id,type,options){
        this.id = id;
        this.type = type;
        this.options = options;
        this.chartContainer;
        this.checkExist;
        this.update;
    }

    // init(){
    //     console.log(document.getElementById(this.id)+" init chart");
    // }
    create(){
        console.log(document.getElementById(this.id)+" createing chart...");

        if(this.id == null || this.type == null || this.options.domainXY == null || this.options.dataset == null){
            console.error("There is a null parameter, you should create all parameters ");
            return;
        }

        // MARGIN 안주면 디폴트
        if(this.options.MARGIN == null){
            this.options.MARGIN = {
                    TOP:0,
                    BOTTOM:50,
                    LEFT:30,
                    RIGHT:50
                }
        }

        if(this.type.toUpperCase() == 'BAR'){this.chartContainer = new Bar(this.id,this.options);}
        if(this.type.toUpperCase() == 'LINE'){this.chartContainer = new Line(this.id,this.options);}
        if(this.type.toUpperCase() == 'PIE'){this.chartContainer = new Pie(this.id,this.options);}
        this.chartContainer.draw(this.options.dataset);

        if(this.checkExist(this.id))ChartContainers.delete(this.id);
        //생성 차트객체 추가
        ChartContainers.set(this.id,this.chartContainer);
        return this.chartContainer;
    }

    //update
    update(syd3,newDataset){
        console.log('get Container :: ', ChartContainers.get(syd3.id))
        ChartContainers.get(syd3.id).draw(newDataset);
    }

    checkExist(id){return ChartContainers.get(id) != undefined;}
}
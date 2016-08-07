require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom' //React版本过高，不支持React.render

//let yeomanImage = require('../images/yeoman.png');

//获取图片的json数据
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转化成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
	for(var i = 0, j = imageDatasArr.length; i < j; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component {
	render() {
		var styleObj = {};
		//如果props属性中制定了这张图片的引用，则使用
		if(this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}

//获取区间内的一个随机数
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high - low) + low);
}

class AppComponent extends React.Component {
	/*
	

	 */


	constructor(props) {
	    super(props);
	    this.state = {
	    	imgsArrangeArr: []
	    };
	};

	//组件加载后执行
	componentDidMount() {
		// this.test();
		//获取舞台大小
		var stageDOM =  ReactDOM.findDOMNode(this.refs.stage),//  this.refs.stage,//React.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//获取imgFigure大小
		var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),//this.refs.imgFigure0,//React.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDom.scrollWidth,
			imgH = imgFigureDom.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		//计算中心图片的位置
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};
		//计算左右侧图片排布范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//计算上侧图片排布范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		
		this.rearrange(0);
	};

	//图片放置的位置范围
	Constant = {
		centerPos: {
			left: 0,
			top: 0
		},
		hPosRange: {	//水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {	//垂直方向的取值范围
			x: [0, 0],
			topY: [0,0]
		}
	};

	//重新布局所有的图片
	rearrange(centerIndex) {
		var imgsArrangeArrLocal = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),//取一个或者不取

			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArrLocal.splice(centerIndex,1);

		//首先剧中centerIndex的图片
		imgsArrangeCenterArr[0].pos = centerPos;

		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArrLocal.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArrLocal.splice(topImgSpliceIndex, topImgNum);

		//布局上侧图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
			};
		});

		//布局两侧图片
		for(var i = 0, j = imgsArrangeArrLocal.length, k = j / 2; i < j ; i++) {
			var hPosRangeLORX = null;

			//前半部分布局左边，右半部分布局右边
			if(i<k){
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArrLocal[i].pos = {
				top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
				left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
			};
		}

		if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArrLocal.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArrLocal.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArrLocal
		});
	};


	render() {
	  	var controllerUnits = [],
	  		imgFigures = [];

	  	imageDatas.forEach(function(value, index){
	  		if(!this.state.imgsArrangeArr[index]){
	  			this.state.imgsArrangeArr[index] = {
	  				pos: {
	  					left: 0,
	  					top: 0
	  				}
	  			};
	  		}
	  		imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
	  	}.bind(this));

	    return (
	      /*
	      <div className="index">
	        <img src={yeomanImage} alt="Yeoman Generator" />
	        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
	      </div>
	       */
	      <section className="stage" ref="stage">
	      	<section className="img-sec">
	      		{imgFigures}
	      	</section>
	      	<nav className="controller-nav">
	      		{controllerUnits}
	      	</nav>
	      </section>
	    );
	};
}

AppComponent.defaultProps = {};

export default AppComponent;

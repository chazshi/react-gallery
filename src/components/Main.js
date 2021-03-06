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



//获取区间内的一个随机数
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high - low) + low);
}

//获取0-30度之间角度
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}



class AppComponent extends React.Component {

	//初始化state//这里是ES6的写法
	constructor(props) {
	    super(props);
	    this.state = {
	    	imgsArrangeArr: [
	    		/*
	    		{
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,	//正反面
					isCenter: false
	    		}
	    		 */
	    	]
	    };
	}

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
	}

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

	/*
	 * 翻转图片
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
	 */
	inverse(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	}

	/**
	 * 利用rearrange函数，居中对应index的图片
	 * @param index 需要被居中的图片对应的图片信息数组的index值
	 * @return {Function}
	 */
	center(index) {
		return function(){
			this.rearrange(index);
		}.bind(this);
	}

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
			topImgNum = Math.floor(Math.random() * 2),//取一个或者不取

			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArrLocal.splice(centerIndex,1);

		//首先剧中centerIndex的图片//居中图片不需要旋转
		imgsArrangeCenterArr[0] = {
			pos:centerPos,
			rotate: 0,
			isCenter: true
		};
		

		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArrLocal.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArrLocal.splice(topImgSpliceIndex, topImgNum);

		//布局上侧图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
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

			imgsArrangeArrLocal[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}

		if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArrLocal.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArrLocal.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArrLocal
		});
	}


	render() {
	  	var controllerUnits = [],
	  		imgFigures = [];

	  	imageDatas.forEach(function(value, index){
	  		if(!this.state.imgsArrangeArr[index]){
	  			this.state.imgsArrangeArr[index] = {
	  				pos: {
	  					left: 0,
	  					top: 0
	  				},
	  				rotate: 0,
	  				isInverse: false,
	  				isCenter: false
	  			};
	  		}
	  		imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

	  		controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
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
	}
}

class ImgFigure extends React.Component {
	//初始化state//这里是ES6的写法
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	    this.state = {
	    	
	    };
	}

	/**
	 * imgFigure的点击处理函数
	 */
	handleClick(e) {
		if(this.props.arrange.isCenter){
			this.props.inverse();
		} else {
			this.props.center();
		}
		
		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		var styleObj = {};
		//如果props属性中制定了这张图片的引用，则使用
		if(this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		//如果旋转角度有值且不为0，添加
		if(this.props.arrange.rotate) {
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}

		if(this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' isInverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}

class ControllerUnit extends React.Component {
	//初始化state//这里是ES6的写法
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	    this.state = {
	    	
	    };
	}

	handleClick(e) {
		//如果点击的是正在选中的按钮，则翻转图片，否则将对应图片居中
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		var controllerUnitClassName = 'controller-unit';
		//如果对应的是居中的图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter) {
			controllerUnitClassName += ' isCenter';
			//如果对应的是翻转的图片，显示控制按钮的翻转态
			if(this.props.arrange.isInverse) {
				controllerUnitClassName += ' isInverse';
			}
		}

		return (
				<span className={controllerUnitClassName} onClick={this.handleClick}></span>
			);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;

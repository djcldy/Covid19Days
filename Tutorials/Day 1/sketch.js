let numX = 96, numY = 96, radius = 200, distance = 10, poseNet, nose, video, faces = []

function setup(){

	createCanvas(1500,720,WEBGL)
	video = createCapture(640,480)
	video.hide()
	rectMode(CENTER)
	poseNet = ml5.poseNet(video)
	poseNet.on('pose', function(results) {

		faces = []
		if (results) {
			results.forEach(result=>{
				if ( result.pose.score > 0.2 ) faces.push({nose:result.pose.nose,leftEye:result.pose.leftEye, rightEye:result.pose.rightEye})
			})
		}
	})
}

function draw(){

	background(255)
	image(video,-width/2+100,-height/2)
	let i = 0 

	faces.forEach(face=>{

		let d = (face.leftEye.x - face.rightEye.x)*2.5
		i++
		var frame = video.get(face.nose.x-d/2, face.nose.y-d/2,d,d)
		image(frame,-width/2,-height/2+100*i,100,100)
		stroke(255,0,0)
		noFill()
		rect(-width/2+100+face.nose.x,-height/2+face.nose.y,d,d)
		noStroke()
		push()
		scale(d/width*5)
		translate(width*0.5-width/2+face.nose.x/video.width*(width*0.5), height*0.2 -height/2+face.nose.y/video.height*height*0.8,d)
		rotateX(PI/2)
		rotateY(PI)
		rotateZ(sin(frameCount*0.01+i/500)*PI)

		for (var b = 0; b < frame.height; b+= d/numY){
			let r = (0.25+sin(b/frame.height*PI))*radius, z = b/frame.height*radius*2
			for (let a = 0; a < frame.width; a += d/numX) {
				let offset = 0 
				let distance =dist(a,b,frame.width/2,frame.height/2) 
				if (distance > frame.width/2) if (random()<0.9) continue
				if (distance < d/8) offset = (d/8-distance)*3
				let angle = a/frame.width*PI
				let x = cos(angle) * (r+offset), y = sin(angle) * (r+offset)
				push()
				fill(frame.get(a,b))
				translate(x, y, z)
				rotateX(angle)
				box(r/numX*2,r/numX*2,r/numX*2)
				pop()
			}	
		}
		pop()
	})
}


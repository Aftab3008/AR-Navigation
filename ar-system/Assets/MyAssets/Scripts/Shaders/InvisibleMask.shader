Shader "Custom/InvisibleMask" {
	// this shader makes an object invisible and obscure objects behind
	// source: https://answers.unity.com/questions/316064/can-i-obscure-an-object-using-an-invisible-object.html
	SubShader {
		// draw after all opaque objects (queue = 2001):
		Tags { "Queue"="Geometry+1" }
		Pass {
			Blend Zero One // keep the image behind it
		}
	}
}
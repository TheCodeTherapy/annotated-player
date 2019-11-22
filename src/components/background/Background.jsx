/* eslint-disable no-console */
/*eslint no-console: ["error", { allow: ["warn", "error", "info"] }] */
import React, { Component } from 'react';
import {
    Vector2,
    WebGLRenderer,
    Scene,
    Camera,
    PlaneBufferGeometry,
    ShaderMaterial,
    Mesh
} from 'three';

import { ease } from './BackgroundHelpers';

import './Background.css';


class Background extends Component {

    componentDidMount() {

        this.frameId = null;

        this.width = this.mount.clientWidth;
        this.height = this.mount.clientHeight;

        this.mouseFocus = false;
        this.mouseX = 0.0;
        this.mouseY = 0.0;
        this.mouseTargetX = 0.0;
        this.mouseTargetY = 0.0;

        this.isTouchDevice = false;

        this.currentTouchPositionX = 0.0;
        this.currentTouchPositionY = 0.0;
        this.lastTouchPositionX = 0.0;
        this.lastTouchPositionY = 0.0;

        this.frictionTarget = 0.017;

        this.frame = 1;

        this.vertexShader = 'varying vec2 vUv;void main(){vUv=uv;vec4 mvPosition=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mvPosition;}';
        this.fragmentShader = 'precision highp float;uniform vec2 resolution;uniform float time,alpha;const mat2 i=mat2(.8,-.6,.6,.8);vec4 j(in vec2 a,in vec4 b,in float d,in bool f){a*=1.-a.yx;float c=pow(abs(a.x*a.y*15.),.25+d);return f?b/=vec4(c):b*=vec4(c);}float g(in float a){return fract(sin(a)*43758.545312);}float h(in vec2 c){vec2 d=floor(c),a=fract(c);a=a*a*(3.-2.*a);float b=d.x+d.y*157.;return mix(mix(g(b),g(b+1.),a.x),mix(g(b+157.),g(b+158.),a.x),a.y);}float e(in vec2 a){float b=0.;b+=.5*h(a),a=i*a*2.02,b+=.25*h(a),a=i*a*2.03,b+=.06*h(a);return b/.9375;}vec3 k(in vec2 b){vec3 a;vec2 c=vec2(0.),d=vec2(0.);c.x=e(b+time*.25),c.y=e(b+vec2(1.)),d.x=e(b+c+vec2(1.7,9.2)+.31*time*.25),d.y=e(b+c+vec2(8.3,2.8)+.21*time*.25);float f=e(b+d);a=mix(vec3(.1,.61,.66),vec3(.66,.66,.49),clamp(f*f*2.,0.,1.)),a=mix(a,vec3(.21,.2,.76),clamp(length(c),0.,1.)),a=mix(a,vec3(.46,.6,.9),clamp(length(d.x),0.,1.));return a;}void main(){vec2 a=gl_FragCoord.xy/resolution.xy,b=-1.+2.*a;b.x+=time*.16;vec3 d=k(b*4.);vec4 c=vec4(d,alpha);gl_FragColor=c,gl_FragColor=j(a,c,.666,false);}';

        this.handleResize = () => {

            this.width = this.mount.clientWidth;
            this.height = this.mount.clientHeight;
            this.renderer.setSize( this.width, this.height );
            this.uniforms.resolution.value.x = this.renderer.domElement.width;
            this.uniforms.resolution.value.y = this.renderer.domElement.height;

        };

        this.handleMouseOut = ( e ) => {

            let from = e.relatedTarget || e.toElement;

            if ( !from || from.nodeName === 'HTML' ) {

                this.mouseFocus = false;

            }

        };

        this.handleMouse = ( e ) => {

            if ( !this.mouseFocus ) { this.mouseFocus = true; }
            this.mouseTargetX = ( ( e.clientX / this.mount.clientWidth ) - 0.5 ) * 2.0;
            this.mouseTargetY = ( ( e.clientY / this.mount.clientHeight ) - 0.5 ) * 2.0;

        };

        this.handleTouch = ( e ) => {

            if ( !this.mouseFocus ) { this.mouseFocus = true; }

            if (
                e.type === 'touchstart' ||
                e.type === 'touchmove' ||
                e.type === 'touchend' ||
                e.type === 'touchcancel'
            ) {

                if ( e.changedTouches !== undefined ) {

                    this.props.clearTitle();
                    let touch = e.changedTouches[0];
                    this.currentTouchPositionX = ( ( touch.clientX / this.mount.clientWidth ) - 0.5 ) * 2.0;
                    this.currentTouchPositionY = ( ( touch.clientY / this.mount.clientHeight ) - 0.5 ) * 2.0;
                    this.mouseTargetX += ( this.currentTouchPositionX - this.lastTouchPositionX ) * 5.0;
                    this.mouseTargetY += ( this.currentTouchPositionY - this.lastTouchPositionY ) * 5.0;
                    this.lastTouchPositionX = this.currentTouchPositionX;
                    this.lastTouchPositionY = this.currentTouchPositionY;

                }

            }

        };

        this.start = () => {

            setTimeout( () => {

                if ( !this.frameId ) {

                    this.uniforms.alpha.value = 0.0;
                    this.frameId = requestAnimationFrame( this.animate );
                    this.handleResize();

                }

            }, 500 );

        };

        this.stop = () => { cancelAnimationFrame( this.frameId ); };

        this.updateUniforms = () => {

            this.uniforms.time.value += 0.01;

            if ( this.uniforms.alpha.value < 1.0 ) {

                this.uniforms.alpha.value += ease( 1.0, this.uniforms.alpha.value, 0.0035 );
                this.uniforms.alpha.value = ( this.uniforms.alpha.value > 0.99 )
                    ? 1.0
                    : this.uniforms.alpha.value;

            }

            this.mount.style.opacity = this.uniforms.alpha.value;

            let mX = this.mouseTargetX;
            let mY = this.mouseTargetY;

            if ( this.mouseFocus ) {

                this.mouseX += Number( ( ( mX - this.mouseX ) * this.frictionTarget ).toFixed( 5 ) );
                this.mouseY += Number( ( ( mY - this.mouseY ) * this.frictionTarget ).toFixed( 5 ) );

            } else {

                this.mouseX += Number( ( ( 0.0 - this.mouseX ) * this.frictionTarget ).toFixed( 5 ) );
                this.mouseY += Number( ( ( 0.0 - this.mouseY ) * this.frictionTarget ).toFixed( 5 ) );

            }

            this.uniforms.mouse.value = { x: this.mouseX, y: this.mouseY };

        };

        this.animate = () => {

            this.frame += 1;
            this.updateUniforms();
            this.renderScene();

            if ( this.frameId !== null ) {

                this.frameId = window.requestAnimationFrame( this.animate );

            }

        };

        this.renderScene = () => {

            this.renderer.render( this.scene, this.camera );

        };

        this.composeAndMount = () => {

            let uniforms = {
                time: { type: 'f', value: 20.0 },
                alpha: { type: 'f', value: 0.0 },
                resolution: { type: 'v2', value: new Vector2( this.width, this.height ) },
                mouse: { type: 'v2', value: new Vector2() }
            };

            let renderer = new WebGLRenderer( { alpha: true } );
            renderer.setSize( this.width, this.height );
            renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer = renderer;
            this.mount.appendChild( this.renderer.domElement );

            let scene = new Scene();

            let camera = new Camera();
            camera.position.z = 1;

            let geometry = new PlaneBufferGeometry( 2, 2 );
            let material = new ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader
            } );
            let mesh = new Mesh( geometry, material );
            scene.add( mesh );

            this.scene = scene;
            this.camera = camera;
            this.uniforms = uniforms;

            window.addEventListener( 'resize', this.handleResize );

            let touchEvents = () => {

                try {

                    document.createEvent( 'TouchEvent' );

                    return true;

                }
                catch ( e ) { return false; }

            };

            if ( touchEvents() ) {

                window.addEventListener( 'touchmove', this.handleTouch );
                this.isTouchDevice = true;

            } else {

                window.addEventListener( 'mouseout', this.handleMouseOut );
                window.addEventListener( 'mousemove', this.handleMouse );
                this.isTouchDevice = false;

            }

            this.start();

        };

        this.composeAndMount();

    }

    componentWillUnmount() {

        window.removeEventListener( 'resize', this.handleResize );

        if ( this.isTouchDevice === false ) {

            window.removeEventListener( 'mouseout', this.handleMouseOut );
            window.removeEventListener( 'mousemove', this.handleMouse );

        } else {

            window.removeEventListener( 'touchmove', this.handleTouch );

        }

        this.stop();
        this.mount.removeChild( this.renderer.domElement );

    }

    shouldComponentUpdate() { return false; }

    render() {

        return (

            <div className="background-canvas" ref = {
                mount => {

                    this.mount = mount;

                }
            } />

        );

    }

}

export default Background;

import React, { Component } from 'react';
import ReactPlayer from 'react-player';

import './VideoPlayer.scss';

class Marker extends Component {

    constructor( props ) {

        super( props );
        this.minutes = parseInt( props.marker.split( ':' )[0] );
        this.seconds = parseInt( props.marker.split( ':' )[1] );
        this.seconds = parseInt( ( this.minutes * 60 ) + this.seconds );
        this.percent = ( this.seconds / props.duration ) * 100;
        this.showToolTip = this.showToolTip.bind( this );
        this.destroyToolTip = this.destroyToolTip.bind( this );
        this.callParentMethod = this.callParentMethod.bind( this );
        this.toolTipWrapper = document.getElementById( 'tooltip_wrapper' );

    }

    showToolTip() {

        let toolTipExists = !!document.getElementById( 'tooltip' );

        if ( !toolTipExists ) {

            let toolTipDiv = document.createElement( 'div' );
            toolTipDiv.id = 'tooltip';
            toolTipDiv.style.height = '100%';

            let toolTipTitle = document.createElement( 'h4' );
            toolTipTitle.innerText = this.props.title;

            let toolTipDescription = document.createElement( 'p' );
            toolTipDescription.innerText = this.props.description;

            let toolTipImage = document.createElement( 'img' );
            let width = this.toolTipWrapper.offsetWidth;
            let height = this.toolTipWrapper.offsetHeight;
            toolTipImage.src = this.props.url;
            toolTipImage.style.width = `${width/2}px`;
            toolTipImage.style.height = `${height/2}px`;
            toolTipImage.style.borderRadius = '30% 30% 5% 5%';

            toolTipDiv.appendChild( toolTipTitle );
            toolTipDiv.appendChild( toolTipDescription );
            toolTipDiv.appendChild( toolTipImage );
            this.toolTipWrapper.style.opacity = 1.0;

            this.toolTipWrapper.appendChild( toolTipDiv );

        }

    }

    destroyToolTip() {

        let toolTipExists = !!document.getElementById( 'tooltip' );

        if ( toolTipExists ) {

            this.toolTipWrapper.style.opacity = 0.0;

            setTimeout( function() {

                let toolTipExists = !!document.getElementById( 'tooltip' );
                if ( toolTipExists ) {

                    document.getElementById( 'tooltip' ).remove();

                }

            }, 300 );

        }

    }

    callParentMethod() {

        this.props.jumpToPoint( ( this.percent ) / 100 );

    }

    render() {

        return (
            <div className="single-marker" style={ { left: this.percent+'%' } }>
                <span
                    className="marker-icons fa fa-star"
                    onClick={this.callParentMethod}
                    onMouseOver={this.showToolTip}
                    onMouseOut={this.destroyToolTip}
                ></span>
            </div>
        );

    }

}

class VideoPlayer extends Component {

    constructor( props ) {

        super( props );

        this.state = {
            url: ( props.url ) ? props.url : 'https://www.youtube.com/watch?v=WhWc3b3KhnY',
            playing: false,
            loop: false,
            controls: false,
            light: false,
            muted: false,
            seeking: false,
            volume: 0.8,
            loaded: 0,
            played: 0,
            duration: false,
            shouldFadeDown: false,
            videoStarted: false
        };

        this.ref = this.ref.bind( this );
        this.jumpToPoint = this.jumpToPoint.bind( this );
        this.handlePlayPause = this.handlePlayPause.bind( this );
        this.handleSeekMouseDown = this.handleSeekMouseDown.bind( this );
        this.handleSeekChange = this.handleSeekChange.bind( this );
        this.handleSeekMouseUp = this.handleSeekMouseUp.bind( this );
        this.handleDuration = this.handleDuration.bind( this );
        this.handleProgress = this.handleProgress.bind( this );

        this.loadBar = null;
        this.loadedColor = null;
        this.toLoadColor = null;
        this.videoElement = null;
        this.playButton = null;

    }

    ref ( player ) {

        this.player = player;

    }

    jumpToPoint( value ) {

        this.eTarget = parseFloat ( value );
        this.setState( { seeking: true, playing: false } );

        setTimeout( function() {

            this.setState( { played: this.eTarget } );

        }
            .bind( this ), 50
        );

        setTimeout( function() {

            this.setState( { seeking: false, shouldFadeDown: true } );
            this.player.seekTo( parseFloat( this.eTarget ) );

        }
            .bind( this ), 250
        );

    }

    handlePlayPause () {

        if ( !this.state.playing ) {

            this.videoElement = document.getElementById( 'react_player' );

            if ( parseFloat( this.videoElement.style.opacity ) > 0.5 ) {

                this.videoElement.style.opacity = 0.0;

            } else {

                this.videoElement.style.opacity = 1.0;

            }


        }

        this.setState( { playing: !this.state.playing } );

    }

    handleSeekMouseDown ( e ) {

        this.setState( { seeking: true, playing: false } );

    }

    handleSeekChange ( e ) {

        this.eTarget = parseFloat ( e.target.value );
        setTimeout( function() {

            this.setState( { played: this.eTarget } );

        }
            .bind( this ), 50
        );

    }

    handleSeekMouseUp ( e ) {

        this.setState( { seeking: false, shouldFadeDown: true } );
        this.player.seekTo( parseFloat( e.target.value ) );

    }

    handleDuration ( duration ) {

        this.setState( { duration } );

    }

    handleProgress ( state ) {

        if ( !this.state.seeking ) {

            this.setState( state );

            if ( this.loadBar === null || this.loadBar === undefined ) {

                this.loadBar = document.getElementById( 'player_load' );

            }

            if ( this.playButton === null || this.playButton === undefined ) {

                this.playButton = document.getElementById( 'play_button' );

            }

            if ( this.loadedColor === null ) {

                this.loadedColor = getComputedStyle( document.documentElement ).getPropertyValue( '--loaded-color' );

            }

            if ( this.toLoadColor === null ) {

                this.toLoadColor = getComputedStyle( document.documentElement ).getPropertyValue( '--to-load-color' );

            }

            if ( this.loadedColor && this.toLoadColor ) {

                const colorStyle = 'linear-gradient(to right,';
                const loadedPercent = ( this.state.loaded * 100 ) + 2;

                const fromColor = `${this.loadedColor} 0%, ${this.loadedColor} ${loadedPercent}%,`;
                const toColor = `${this.toLoadColor} ${loadedPercent}%, ${this.toLoadColor} 100%)`;
                const colorString = `${colorStyle} ${fromColor} ${toColor}`;

                this.loadBar.style.background = colorString;

            }

        }

    }

    componentDidUpdate ( ) {

        const {
            playing,
            seeking,
            shouldFadeDown
        } = this.state;

        if ( this.videoElement !== null ) {

            let videoOpacity = parseFloat( this.videoElement.style.opacity );

            if ( !playing && !seeking && !shouldFadeDown && videoOpacity === 1.0 ) {

                this.setState( { playing: true } );

            }

            if ( !playing && !seeking && shouldFadeDown && videoOpacity === 0.0 ) {

                setTimeout( function() {

                    this.setState( { shouldFadeDown: false } );
                    this.videoElement.style.opacity = 1.0;

                }
                    .bind( this ), 1000
                );

            }

        }

        if ( this.state.videoStarted === false && playing ) {

            this.setState( { videoStarted: true } );

        }

    }

    shouldComponentUpdate ( ) { return true; }

    render() {

        const {
            url,
            played,
            controls,
            playing,
            shouldFadeDown
        } = this.state;

        if ( this.videoElement !== null ) {

            let videoOpacity = parseFloat( this.videoElement.style.opacity );

            if ( shouldFadeDown && !playing && videoOpacity === 1.0 && played * 1000 > 0 ) {

                this.videoElement.style.opacity = 0.0;

            }


        }

        if ( this.playButton !== null && this.playButton !== undefined ) {

            this.playButton.style.opacity = ( playing )
                ? 0.0
                : ( played * 100 > 0 )
                    ? 0.0
                    : 1.0 ;

        }

        return (
            <div className="video-player-wrapper">
                <div className="tooltip-wrapper" id="tooltip_wrapper"></div>
                <div className="play-button" onClick={this.handlePlayPause}>
                    <i className="player-buttons fa fa-play" id="play_button"></i>
                </div>
                <div className='react-player-wrapper'>
                    <input
                        className="player-load"
                        id="player_load"
                        type="range" min="0" max="1" step="any"
                    >
                    </input>
                    <ReactPlayer
                        className='react-player'
                        id='react_player'
                        ref={this.ref}
                        url={url}
                        width="100%"
                        height="100%"
                        controls={controls}
                        playing={playing}
                        onProgress={this.handleProgress}
                        onDuration={this.handleDuration}
                    />
                    <div className="seek-bar">
                        <input
                            className="player-seek"
                            id="player_seek"
                            type="range" min="0" max="1" step="any"
                            value={played}
                            onMouseDown={this.handleSeekMouseDown}
                            onChange={this.handleSeekChange}
                            onMouseUp={this.handleSeekMouseUp}
                        >
                        </input>
                        <div className="markers-wrapper">
                            {this.state.duration
                                ? Object.keys( this.props.markers ).map( ( marker, idx ) => (
                                    <Marker
                                        key={idx}
                                        marker={marker}
                                        title={this.props.markers[marker].title}
                                        description={this.props.markers[marker].description}
                                        url={this.props.markers[marker].thumbURL}
                                        duration={this.state.duration}
                                        jumpToPoint={this.jumpToPoint}
                                    />
                                ) )
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );

    }

}

export default VideoPlayer;

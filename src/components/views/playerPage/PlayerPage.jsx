import React, { Component } from 'react';
import VideoPlayer from '../../player/VideoPlayer';

import './PlayerPage.css';

const videoMarkers = {

    '00:51': {
        'title': 'Happiness',
        'description': 'Sharing what we value with our best friends is like sowing happiness.',
        'thumbURL': 'https://s3.eu-west-2.amazonaws.com/s3uk.mgz.me/vod/happines.jpg'
    },
    '02:16': {
        'title': 'The Awakening',
        'description': 'Incredible things can happen when you\'re brave enough to explore the world and push through its limits.',
        'thumbURL': 'https://s3.eu-west-2.amazonaws.com/s3uk.mgz.me/vod/awakening.jpg'
    },
    '03:17': {
        'title': 'The Sounds we make Together',
        'description': 'Music can break all barriers. It is the most powerful form of communication.',
        'thumbURL': 'https://s3.eu-west-2.amazonaws.com/s3uk.mgz.me/vod/sounds.jpg'
    },
    '03:44': {
        'title': 'Claiming the Power',
        'description': 'If you\'re brave enough to claim power over lives, you must be responsible for them.',
        'thumbURL': 'https://s3.eu-west-2.amazonaws.com/s3uk.mgz.me/vod/power.jpg'
    },
    '04:12': {
        'title': 'The Unforeseen',
        'description': 'You must be prepared for every unforeseen crisis you may encounter in your path.',
        'thumbURL': 'https://s3.eu-west-2.amazonaws.com/s3uk.mgz.me/vod/unforeseen.jpg'
    },
    '04:45': {
        'title': 'The Sacrifice',
        'description': 'Be prepared to risk your life to protect those who really love you.',
        'thumbURL': 'https://s3.eu-west-2.amazonaws.com/s3uk.mgz.me/vod/sacrifice.jpg'
    },
    '06:05': {
        'title': 'Everything will be fine',
        'description': 'Life holds the most beautiful rewards for those who embrace it.',
        'thumbURL': 'https://s3.eu-west-2.amazonaws.com/s3uk.mgz.me/vod/fine.jpg'
    }
};

const videoURL = 'https://s3.eu-west-2.amazonaws.com/s3uk.mgz.me/vod/spring.mp4';

class PlayerPage extends Component {

    render() {

        return(

            <div className="player-container" id="player_container">
                <VideoPlayer url={videoURL} markers={videoMarkers} />
            </div>

        );

    }

}

export default PlayerPage;
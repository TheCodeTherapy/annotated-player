# Annotated Player

Annotated Player is a **React-based HTML5 video-player** with configurable **time-based markers** on the video's timeline progress bar, to jump to specific points in time.

Each marker, when mouse-overed, shows its respective marker Title, Description and Thumbnail inside the player, so the user can have a preview of that specific point.

This player may be useful for long lectures or talks in which several subjects are explored, or simply to organize any video into easily accessible chapters or sections. The marker's thumbnail uses an image file instead of a frame from the video so you can customize a slide or image that better represents that video's section.

The video player also tries to provide smooth transitions to the video seeking action, thus, also when you click on a marker.

You can view the final result / production build at [https://player.mgz.me](https://player.mgz.me)

You can also check my WebGL Projects at my personal website [https://mgz.me](https://mgz.me) ).

- The player is a single React Component, and can be imported to any desired page with `import VideoPlayer from '../../player/VideoPlayer';` (with obvious required replacements regarding the relative path from where the Component is being imported and invoked).

- The configuration is as simple as possible. It can be done by editing a single JavaScript Object as in the example below:

```
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
    }
};
```

As it can be seen in the example above, the object key represents a time in Mins:Secs for a specific desired point on the video, and the object assigned to the same key contains the annotation Title, Description and the Thumbnail image URL.

**This project is a WIP, in its very initial stages of development, and there's a lot of room for improvement.**

In a near future, I'll extend the configuration possibilities in a sense that the timeline colors, annotation symbols, and even the annotations' CSS previews styles will offer the possibility of being customized in the same object used to store the markers.

Smooth transitions when seeking a different point on the video were implemented in quite a hackish way, but it works fine for now, however, there's also a lot of room for improvements and optimization for this feature.

I also plan to provide this player as npm-package in a near future once I consider it to be polished enough.

## Development

### `npm start`

Runs the app in the development mode, making it available with real-time preview at [http://localhost:3000] with lint errors in the browser's console.

### `npm run build`

Builds the app for production to the `build` folder, correctly bundling React in production mode by optimizing the build for the best file compression, minification and viewing performance.

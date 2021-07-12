/*<html prefix="og:  https://ogp.me/ns/website#">
<head>
<title>Rezerve</title>
<meta property="og:title" content="REZERVE" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://rezerve-startup.herokuapp.com/preview" />
<meta property="og:image" content="https://ia.media-imdb.com/images/rock.jpg" />
</head>

</html>*/

import React from 'react';
import Thumbnail from 'react-thumbnail';
import ReactDOM from 'react-dom';
 
ReactDOM.render(
  <Thumbnail width={250}
             height={250}
             page="https://facebook.github.io/react/docs/getting-started.html"
             scale={4} />,
  document.getElementById('root')
)
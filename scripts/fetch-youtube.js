const https = require('https');

https.get('https://www.youtube.com/feeds/videos.xml?channel_id=UCNxCMmFZaWIWKZClzLP0v9g', (res) => {
  let xml = '';
  res.on('data', chunk => xml += chunk);
  res.on('end', () => {
    const entries = xml.split('<entry>');
    const videos = [];
    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i];
      const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      const urlMatch = entry.match(/<link rel="alternate" href="(.*?)"/);
      const dateMatch = entry.match(/<published>(.*?)<\/published>/);
      if (idMatch && titleMatch) {
        videos.push({
          id: idMatch[1],
          title: titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          url: urlMatch ? urlMatch[1] : `https://www.youtube.com/watch?v=${idMatch[1]}`,
          published: dateMatch ? dateMatch[1] : ''
        });
      }
    }
    console.log(JSON.stringify(videos, null, 2));
  });
});

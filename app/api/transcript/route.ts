// Code extracted from: https://github.com/xenova/chat-with-youtube/blob/main/extension/src/content.js
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface Events {
  tStartMs: number;
  dDurationMs?: number;
  id?: number;
  wpWinPosId?: number;
  wsWinStyleId?: number;
  wWinId?: number;
  segs?: Seg[];
  aAppend?: number;
}

interface Seg {
  utf8: string;
  acAsrConf?: number;
  tOffsetMs?: number;
}

// Regex to parse the player response from the page (when transcript is not available on the window)
const YT_INITIAL_PLAYER_RESPONSE_RE = /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/

const getVideoId = (url: string): string | null => {
  if (!url.trim()) return "";
  const match = url.match(
    /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
  );
  if (match !== null && match[1].length === 11) {
    return match[1];
  } else {
    return null
  }
}

/**
 * Comparison function used to sort tracks by priority
 */
type Track = { languageCode: string; kind: string };

function compareTracks(track1: Track, track2: Track) {
  const langCode1 = track1.languageCode;
  const langCode2 = track2.languageCode;

  if (langCode1 === 'en' && langCode2 !== 'en') {
    return -1; // English comes first
  } else if (langCode1 !== 'en' && langCode2 === 'en') {
    return 1; // English comes first
  } else if (track1.kind !== 'asr' && track2.kind === 'asr') {
    return -1; // Non-ASR comes first
  } else if (track1.kind === 'asr' && track2.kind !== 'asr') {
    return 1; // Non-ASR comes first
  }

  return 0; // Preserve order if both have same priority
}

export async function POST(req: NextRequest) {
  const { url } = await req.json() as { url: string };

  const { userId } = getAuth(req);

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const videoID = getVideoId(url);

  if (!videoID) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }

  const pageData = fetch(`https://www.youtube.com/watch?v=${videoID}`);
  const body = await (await pageData).text();
  const playerResponse = body.match(YT_INITIAL_PLAYER_RESPONSE_RE);
  if (!playerResponse) {
    NextResponse.json({ error: 'Unable to parse video' }, { status: 400 });
    return;
  }

  const player = JSON.parse(playerResponse[1]);
  const metadata = {
    title: player.videoDetails.title,
    duration: player.videoDetails.lengthSeconds,
    author: player.videoDetails.author,
    views: player.videoDetails.viewCount,
  }

  if (!player.captions) {
    return NextResponse.json({ error: 'Transcript not available' }, { status: 400 });
  }

  // Get the tracks and sort them by priority
  const tracks = player.captions.playerCaptionsTracklistRenderer.captionTracks;
  tracks.sort(compareTracks);

  // Get the transcript
  const transcript = await (await fetch(tracks[0].baseUrl + '&fmt=json3')).json();

  const parsed = (transcript.events as Events[])
    .map((t) => ({
      segs: t.segs,
      timestamp: `${millisecondsToTime(t.tStartMs)} --> ${millisecondsToTime(t.tStartMs + (t.dDurationMs ?? 0))}`,
    }))
    .filter((t) => t.segs)
    .filter(x => Boolean(x.segs?.[0].utf8.replace('\n', '')))
    .map((x) => {
      return {
        timestamp: x.timestamp,
        content: x.segs!.map((y) => y.utf8).join(" "),
      };
    })

  const parsedTranscript = parsed
    .map((t) => `${t.timestamp}\n${t.content}`) // maybe unnecessary new line at the end
    .join("\n\n")
    .replaceAll('  ', ' ')

  const parsedContent = parsed
    .map((t) => t.content)
    .join(' ')
    // Remove invalid characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Replace any whitespace with a single space
    .replace(/\s+/g, ' ');

  return NextResponse.json({ parsedContent, parsedTranscript, metadata })
}

function millisecondsToTime(duration: number): string {
  let milliseconds: string | number = parseInt(((duration % 1000)).toString()),
    seconds: string | number = Math.floor((duration / 1000) % 60),
    minutes: string | number = Math.floor((duration / (1000 * 60)) % 60),
    hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  milliseconds = (milliseconds < 100) ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds;

  milliseconds = Math.round(Number(milliseconds) / 10);

  return hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
}

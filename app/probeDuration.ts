// Read the natural length (seconds) of a video/audio source in the browser.

const probe = (kind: "video" | "audio", src: string, revoke: boolean): Promise<number | undefined> =>
  new Promise((resolve) => {
    const el = document.createElement(kind);
    let settled = false;
    const done = (v?: number) => {
      if (settled) return;
      settled = true;
      if (revoke) URL.revokeObjectURL(src);
      resolve(v);
    };
    el.preload = "metadata";
    el.onloadedmetadata = () =>
      done(Number.isFinite(el.duration) && el.duration > 0 ? el.duration : undefined);
    el.onerror = () => done(undefined);
    el.src = src;
    setTimeout(() => done(undefined), 10000);
  });

export const probeDuration = (file: File): Promise<number | undefined> => {
  if (!/^(video|audio)\//.test(file.type)) return Promise.resolve(undefined);
  const kind = file.type.startsWith("video") ? "video" : "audio";
  return probe(kind, URL.createObjectURL(file), true);
};

export const probeDurationFromUrl = (
  kind: "video" | "audio",
  url: string,
): Promise<number | undefined> => probe(kind, url, false);

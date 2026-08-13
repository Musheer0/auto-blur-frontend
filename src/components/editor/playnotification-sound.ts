let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      (window as any).webkitAudioContext
    )();
  }

  return audioContext;
};

export const unlockNotificationSound = async () => {
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
  }
};

export const playNotificationSound = async () => {
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";

  // Two-tone success/notification sound.
  oscillator.frequency.setValueAtTime(
    880,
    ctx.currentTime,
  );

  oscillator.frequency.setValueAtTime(
    1174,
    ctx.currentTime + 0.12,
  );

  gain.gain.setValueAtTime(
    0.001,
    ctx.currentTime,
  );

  gain.gain.exponentialRampToValueAtTime(
    0.3,
    ctx.currentTime + 0.02,
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + 0.35,
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.35);
};

export const playErrorSound = async () => {
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "square";

  // Two loud beeps with a clear gap.
  oscillator.frequency.setValueAtTime(440, now);
  oscillator.frequency.setValueAtTime(440, now + 0.12);

  oscillator.frequency.setValueAtTime(440, now + 0.22);
  oscillator.frequency.setValueAtTime(440, now + 0.24);

  // First beep.
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.7, now + 0.01);
  gain.gain.setValueAtTime(0.7, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  // Second beep.
  gain.gain.setValueAtTime(0.001, now + 0.22);
  gain.gain.exponentialRampToValueAtTime(0.7, now + 0.43);
  gain.gain.setValueAtTime(0.7, now + 0.32);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.54);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.55);
};
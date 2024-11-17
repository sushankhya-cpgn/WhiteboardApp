const getCameraStreamAndSend = async (pc, videoref) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (videoref.current) {
      videoref.current.srcObject = stream;
      videoref.current.play();
    }
    stream.getTracks().forEach((track) => {
      pc.addTrack(track);
    });
  } catch (err) {
    console.error("Error accessing camera:", err);
  }
};

export default getCameraStreamAndSend;

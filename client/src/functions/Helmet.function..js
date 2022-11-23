export const drawBoxHelmet = (detections, frame, canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, frame.width, frame.height);
    // Font options.
    let font = "16px sans-serif";
    ctx.font = font
    ctx.textBaseline = "top";
    detections.forEach(item => {
        const x = item['bbox'][0] * frame.offsetWidth;
        const y = item['bbox'][1] * frame.offsetHeight;
        const width = (item['bbox'][2] - item['bbox'][0]) * frame.offsetWidth;
        const height = (item['bbox'][3] - item['bbox'][1]) * frame.offsetHeight

        // Draw the bounding box.
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        // ctx.strokeRect(0, 0, 1920, 700);
        // Draw the label background.
        ctx.fillStyle = "#00FFFF";
        const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    let isCanConfirm = true
    let checkAnyUnSafe = false
    detections.forEach(item => {
        if (item["label"]=== 'No_Helmet') {
            checkAnyUnSafe = true
            console.log('dd')
        }
        const x = item['bbox'][0] * frame.offsetWidth;
        const y = item['bbox'][1] * frame.offsetHeight;

        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%", x, y);

    });

    if (checkAnyUnSafe)
        isCanConfirm = false

    return { detections, isCanConfirm }
    
}
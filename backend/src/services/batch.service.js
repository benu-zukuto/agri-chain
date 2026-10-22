exports.generateBatchId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `BATCH-${timestamp}`;
};

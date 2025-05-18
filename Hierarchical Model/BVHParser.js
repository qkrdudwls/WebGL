class BVHParser {
    constructor(bvhText) {
        const [hierarchyPart, motionPart] = bvhText.split("MOTION");
        this.frames = [];
        this.jointOrder = this.extractJointOrder(hierarchyPart);
        this.channelCount = this.jointOrder.reduce((acc, j) => acc + j.channels.length, 0);

        this.parseMotionData(motionPart.trim());
    }

    extractJointOrder(hierarchyText) {
        const jointOrder = [];
        const jointRegex = /(ROOT|JOINT)\s+([^\s{]+)[\s\S]*?CHANNELS\s+(\d+)\s+([^\n]+)/g;
        let match;
        while ((match = jointRegex.exec(hierarchyText)) !== null) {
            const name = match[2];
            const channels = match[4].trim().split(/\s+/);
            jointOrder.push({ name, channels });
        }
        return jointOrder;
    }

    parseMotionData(motionText) {
        const lines = motionText.split("\n").filter(line => line.trim().length > 0);
        const frameDataLines = lines.slice(2); // Skip "Frames:" and "Frame Time:"
        this.frames = frameDataLines.map(line => line.trim().split(/\s+/).map(Number));
    }

    getJointPose(frameIndex, jointName) {
        const jointIndex = this.jointOrder.findIndex(j => j.name === jointName);
        if (jointIndex === -1) return null;

        let offset = 0;
        for (let i = 0; i < jointIndex; i++) {
            offset += this.jointOrder[i].channels.length;
        }

        const channels = this.jointOrder[jointIndex].channels;
        const frame = this.frames[frameIndex];

        const pose = {};
        for (let i = 0; i < channels.length; i++) {
            pose[channels[i]] = frame[offset + i];
        }
        return pose;
    }
}
import * as Tone from 'tone';
import worklet from '-!url-loader?limit=false!./worklet';

export class Synth {
    constructor() {
        this._input = new Tone.Gain();
        const reverb = new Tone.Reverb().set({
            wet: 0.3,
            decay: 0.5,
            preDelay: 0.01,
        });
        this._gain = new Tone.Gain(1);
        const limiter = new Tone.Limiter(-20);

        this._input.chain(reverb, this._gain, limiter, Tone.Destination);
    }

    async setup() {
        const context = Tone.getContext();

        await context.addAudioWorkletModule(worklet, 'main');
        const workletNode = context.createAudioWorkletNode('main', {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        });
        this._port = workletNode.port;

        Tone.connect(workletNode, this._input);
    }

    setWorkletParams(params) {
        this._gain.gain.value = params.volume;
        this._port.postMessage({
            type: 'params',
            params,
        });
    }

    noteOn(note) {
        this._port.postMessage({
            type: 'noteOn',
            note,
        });
    }

    noteOff(note) {
        this._port.postMessage({
            type: 'noteOff',
            note,
        });
    }

    sustain(down) {
        this._port.postMessage({
            type: 'sustain',
            down,
        });
    }
}

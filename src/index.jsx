import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { Synth } from './synth';
import * as Tone from 'tone';

const groups = [
    {
        label: 'Osc A',
        knobs: [
            {
                id: 'oscACoarse',
                label: 'Coarse',
                minValue: -24,
                maxValue: 24,
                defaultValue: 0,
                step: 1,
            },
            {
                id: 'oscAFine',
                label: 'Fine',
                minValue: -1,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
        ],
        color: '#21cd92',
    },
    {
        label: 'Osc B',
        knobs: [
            {
                id: 'oscBCoarse',
                label: 'Coarse',
                minValue: -24,
                maxValue: 24,
                defaultValue: 0,
                step: 1,
            },
            {
                id: 'oscBFine',
                label: 'Fine',
                minValue: -1,
                maxValue: 1,
                defaultValue: 0.1,
                step: 'any',
            },
        ],
        color: '#21cd92',
    },
    {
        label: 'Mixer',
        knobs: [
            {
                id: 'oscALevel',
                label: 'Osc A',
                minValue: 0,
                maxValue: 1,
                defaultValue: 1,
                step: 'any',
            },
            {
                id: 'oscBLevel',
                label: 'Osc B',
                minValue: 0,
                maxValue: 1,
                defaultValue: 1,
                step: 'any',
            },
            {
                id: 'noiseLevel',
                label: 'Noise',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
        ],
        color: '#ED31A2',
    },
    {
        label: 'Filter',
        knobs: [
            {
                id: 'filterCutoff',
                label: 'Cutoff',
                minValue: 0,
                maxValue: 1,
                defaultValue: 1,
                step: 'any',
            },
            {
                id: 'filterResonance',
                label: 'Resonance',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
            {
                id: 'filterEnvAmount',
                label: 'Env Amount',
                minValue: -1,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
        ],
        color: '#FA9C34',
    },
    {
        label: 'Filter Env',
        knobs: [
            {
                id: 'filterEnvAttack',
                label: 'Attack',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
            {
                id: 'filterEnvDecay',
                label: 'Decay',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
            {
                id: 'filterEnvSustain',
                label: 'Sustain',
                minValue: 0,
                maxValue: 1,
                defaultValue: 1,
                step: 'any',
            },
            {
                id: 'filterEnvRelease',
                label: 'Release',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
        ],
        color: '#23cde8',
    },
    {
        label: 'Amp Env',
        knobs: [
            {
                id: 'ampEnvAttack',
                label: 'Attack',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
            {
                id: 'ampEnvDecay',
                label: 'Decay',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
            {
                id: 'ampEnvSustain',
                label: 'Sustain',
                minValue: 0,
                maxValue: 1,
                defaultValue: 1,
                step: 'any',
            },
            {
                id: 'ampEnvRelease',
                label: 'Release',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0,
                step: 'any',
            },
        ],
        color: '#23cde8',
    },
    {
        label: 'Master',
        knobs: [
            {
                id: 'volume',
                label: 'Volume',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0.5,
                step: 'any',
            },
            {
                id: 'panSpread',
                label: 'Pan Spread',
                minValue: 0,
                maxValue: 1,
                defaultValue: 0.3,
                step: 'any',
            },
        ],
        color: '#fffb43',
    },
];

function Knob({
    label,
    color,
    minValue,
    maxValue,
    defaultValue,
    step,
    onChange,
}) {
    const [value, setValue] = useState(
        (defaultValue - minValue) / (maxValue - minValue)
    );
    const [mouseDown, setMouseDown] = useState(false);

    function handleMouseDown(e) {
        e.preventDefault();
        setMouseDown(true);
    }

    useEventListener('mousemove', (e) => {
        if (mouseDown) {
            e.preventDefault();
            const newValue = Math.max(
                0,
                Math.min(1, value - e.movementY / 246)
            );
            setValue(newValue);

            let outValue = minValue + (maxValue - minValue) * newValue;
            if (step !== 'any') {
                outValue = Math.floor(outValue / step) * step;
            }
            onChange(outValue);
        }
    });

    useEventListener('mouseup', () => {
        setMouseDown(false);
    });

    return (
        <div className="rela-inline knob">
            <div className="rela-block knob-dial" style={{ color }}>
                <div
                    className="abs-center dial-grip"
                    style={{
                        transform: `translate(-50%,-50%) rotate(${
                            132 * (2 * value - 1)
                        }deg)`,
                    }}
                    onMouseDown={handleMouseDown}
                />
                <svg className="dial-svg" viewBox="0 0 100 100">
                    <path
                        d="M20,76 A 40 40 0 1 1 80 76"
                        fill="none"
                        stroke="#55595C"
                    />
                    <path
                        d="M20,76 A 40 40 0 1 1 80 76"
                        fill="none"
                        stroke={color}
                        style={{ strokeDashoffset: 184 * (1 - value) }}
                    />
                </svg>
            </div>
            <div className="rela-block knob-label">{label}</div>
        </div>
    );
}

function Group({ label, color, knobs, setParams }) {
    return (
        <div className="rela-inline group-container">
            <div className="rela-block group-label">{label}</div>
            <div className="rela-inline knob-container">
                {knobs.map(
                    ({ id, label, minValue, maxValue, defaultValue, step }) => (
                        <Knob
                            key={id}
                            label={label}
                            color={color}
                            minValue={minValue}
                            maxValue={maxValue}
                            defaultValue={defaultValue}
                            step={step}
                            onChange={(x) => {
                                setParams((params) => ({
                                    ...params,
                                    [id]: x,
                                }));
                            }}
                        />
                    )
                )}
            </div>
        </div>
    );
}

const DEFAULT_PARAMS = (() => {
    const params = {};
    for (const group of groups) {
        for (const knob of group.knobs) {
            params[knob.id] = knob.defaultValue;
        }
    }
    return params;
})();

function App() {
    const synthRef = useRef();
    const [params, setParams] = useState(DEFAULT_PARAMS);

    const setupSynth = useCallback(async () => {
        await Tone.start();

        const synth = new Synth();
        await synth.setup();
        synth.setWorkletParams(DEFAULT_PARAMS);

        return synth;
    }, []);

    useEffect(() => {
        setupSynth().then((synth) => (synthRef.current = synth));
    }, [setupSynth]);

    useEffect(() => {
        if (synthRef.current) {
            synthRef.current.setWorkletParams(params);
        }
    }, [synthRef, params]);

    // prettier-ignore
    const KEYS = [
        'KeyA', 'KeyW', 'KeyS', 'KeyE', 'KeyD', 'KeyF', 'KeyT', 'KeyG',
        'KeyY', 'KeyH', 'KeyU', 'KeyJ', 'KeyK', 'KeyO', 'KeyL'
    ];
    useEventListener('keydown', (e) => {
        if (e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
            return;
        }

        const i = KEYS.indexOf(e.code);
        if (i !== -1) {
            e.preventDefault();
            synthRef.current.noteOn(i + 60);
        }
    });
    useEventListener('keyup', (e) => {
        const i = KEYS.indexOf(e.code);
        if (i !== -1) {
            e.preventDefault();
            synthRef.current.noteOff(i + 60);
        }
    });

    return (
        <div>
            {groups.map(({ label, color, knobs }) => (
                <Group
                    key={label}
                    label={label}
                    color={color}
                    knobs={knobs}
                    setParams={setParams}
                />
            ))}
        </div>
    );
}

const root = document.getElementById('root');
ReactDOM.render(<App />, root);

function useEventListener(event, handler, element = window) {
    const handlerRef = useRef();

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const listener = (e) => handlerRef.current(e);
        element.addEventListener(event, listener);
        return () => element.removeEventListener(event, listener);
    }, [element, event]);
}

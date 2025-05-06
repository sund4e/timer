export interface MockAudioElement {
    play: jest.Mock;
    pause: jest.Mock;
    load: jest.Mock;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    currentTime: number;
}

let mockAudioInstance: MockAudioElement | null = null;
let mockAudioConstructor: jest.Mock | null = null;
const originalAudio = typeof window !== 'undefined' ? window.Audio : undefined;

export const setupAudioMock = () => {
    mockAudioInstance = {
        play: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn(),
        load: jest.fn(),
        addEventListener: jest.fn((event, cb) => {
            if (event === 'canplaythrough') {
                cb();
            }
        }),
        removeEventListener: jest.fn(),
        currentTime: 0,
    };
    mockAudioConstructor = jest.fn().mockImplementation(() => mockAudioInstance);

    Object.defineProperty(window, 'Audio', {
        value: mockAudioConstructor,
        writable: true,
        configurable: true
    });
};

export const restoreAudioMock = () => {
    mockAudioConstructor?.mockRestore();

    Object.defineProperty(window, 'Audio', {
        value: originalAudio,
        writable: true,
        configurable: true
    });
    mockAudioInstance = null;
    mockAudioConstructor = null;
};

export const getMockAudioInstance = (): MockAudioElement => {
    if (!mockAudioInstance) {
        throw new Error('Audio mock not set up. Call setupAudioMock() in a beforeEach block.');
    }
    return mockAudioInstance;
}; 
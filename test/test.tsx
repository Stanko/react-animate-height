import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

import AnimateHeight, { Height } from '../src/index';

const DemoContent = () => {
  return (
    <div className="demo-content">
      <p>
        It looked serious, but we in California, like everywhere else, were not
        alarmed. We were sure that the bacteriologists would find a way to
        overcome this new germ, just as they had overcome other germs in the
        past. But the trouble was the astonishing quickness with which this germ
        destroyed human beings, and the fact that it inevitably killed any human
        body it entered. No one ever recovered. There was the old Asiatic
        cholera, when you might eat dinner with a well man in the evening, and
        the next morning, if you got up early enough, you would see him being
        hauled by your window in the death-cart. But this new plague was quicker
        than that&mdash;much quicker.
      </p>
      <input className="form-control" type="text" placeholder="Focus test" />
      <p>
        From the moment of the first signs of it, a man would be dead in an
        hour. Some lasted for several hours. Many died within ten or fifteen
        minutes of the appearance of the first signs.
      </p>
      <p>
        The heart began to beat faster and the heat of the body to increase.
        Then came the scarlet rash, spreading like wildfire over the face and
        body. Most persons never noticed the increase in heat and heart-beat,
        and the first they knew was when the scarlet rash came out. Usually,
        they had convulsions at the time of the appearance of the rash. But
        these convulsions did not last long and were not very severe. If one
        lived through them, he became perfectly quiet, and only did he feel a
        numbness swiftly creeping up his body from the feet. The heels became
        numb first, then the legs, and hips, and when the numbness reached as
        high as his heart he died. They did not rave or sleep. Their minds
        always remained cool and calm up to the moment their heart numbed and
        stopped. And another strange thing was the rapidity of decomposition. No
        sooner was a person dead than the body seemed to fall to pieces, to fly
        apart, to melt away even as you looked at it. That was one of the
        reasons the plague spread so rapidly. All the billions of germs in a
        corpse were so immediately released.
      </p>
    </div>
  );
};

const Example = () => {
  const [height1, setHeight1] = useState<Height>(0);
  const [useCallbacks, setUseCallbacks] = useState<boolean>(false);

  const [height2, setHeight2] = useState<Height>('auto');
  const [height3, setHeight3] = useState<Height>('auto');
  const [delay, setDelay] = useState<number>(0);

  const options: Height[] = [0, 100, '50%', 'auto'];
  const delays: number[] = [0, 300, 600, 1000];

  return (
    <div style={{ height: '500px' }}>
      {options.map((option) => {
        const isActive = height1 === option;
        return (
          <button
            key={option}
            id={`test-1-${option.toString().replace('%', 'percent')}`}
            className={`btn btn-sm ${isActive ? 'btn-selected' : ''}`}
            onClick={() => setHeight1(option)}
          >
            {option}
          </button>
        );
      })}
      <button
        id="test-1-toggle-callbacks"
        onClick={() => setUseCallbacks(!useCallbacks)}
      >
        Toggle callbacks
      </button>
      <AnimateHeight
        id="test-1"
        height={height1}
        className="demo demo-1"
        onHeightAnimationStart={
          useCallbacks
            ? (height) => {
                console.warn('Animation started', height);
              }
            : undefined
        }
        onHeightAnimationEnd={
          useCallbacks
            ? (height) => {
                console.warn('Animation ended', height);
              }
            : undefined
        }
      >
        <DemoContent />
      </AnimateHeight>
    </div>
  );
};

const container = document.getElementById('demo') as Element;
const root = createRoot(container);

root.render(
  <StrictMode>
    <Example />
  </StrictMode>
);

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import AnimateHeight from '../source/index';
import './docs.css';

const Example = class extends React.Component {
  constructor() {
    super();

    this.state = {
      height: 0,
      height2: 'auto',
      height3: 'auto',
      delay: 0,
    };
  }

  render() {
    const {
      height,
      height2,
      height3,
      delay,
    } = this.state;

    return (
      <div>
        <h3>Demo, starting height = 0</h3>
        <p>
          Current Height: <b>{ height !== null ? height : 'null' }</b>
        </p>
        <p className=''>Set height to:</p>
        <div className='buttons'>
          <button className='btn btn-sm' onClick={ () => this.setState({ height: 0 }) }>
            0
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height: 100 }) }>
            100
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height: 200 }) }>
            200
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height: 300 }) }>
            300
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height: 'auto' }) }>
            auto
          </button>
        </div>
        <AnimateHeight
          height={ height }
          className='demo demo-1'
        >
          <div className='demo-content'>
            <p>
              It looked serious, but we in California, like everywhere else, were
              not alarmed. We were sure that the bacteriologists would find a way to
              overcome this new germ, just as they had overcome other germs in the
              past. But the trouble was the astonishing quickness with which this germ
              destroyed human beings, and the fact that it inevitably killed any
              human body it entered. No one ever recovered. There was the old Asiatic
              cholera, when you might eat dinner with a well man in the evening, and
              the next morning, if you got up early enough, you would see him being
              hauled by your window in the death-cart. But this new plague was quicker
              than that&mdash;much quicker.
            </p>
            <input
              className='form-control'
              type='text'
              placeholder='Test for focus'
              onFocus={ () => console.log('Input 1 focused') }
            />
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
              numb first, then the legs, and hips, and when the numbness reached
              as high as his heart he died. They did not rave or sleep. Their minds
              always remained cool and calm up to the moment their heart numbed and
              stopped. And another strange thing was the rapidity of decomposition. No
              sooner was a person dead than the body seemed to fall to pieces, to
              fly apart, to melt away even as you looked at it. That was one of the
              reasons the plague spread so rapidly. All the billions of germs in a
              corpse were so immediately released.
            </p>
          </div>
        </AnimateHeight>

        <h3>Demo, starting height = auto</h3>
        <p>
          For this example, duration is set to 500ms.
          If you open up the console, you&apos;ll see <code>onAnimationEnd</code> and
          <code>onAnimationStart</code> callbacks.
          <code>animateOpacity</code> is set to true.
        </p>
        <p>
          Current Height: <b>{ height !== null ? height2 : 'null' }</b>
        </p>
        <p className=''>Set height to:</p>
        <div className='buttons'>
          <button className='btn btn-sm' onClick={ () => this.setState({ height2: 0 }) }>
            0
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height2: 100 }) }>
            100
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height2: 200 }) }>
            200
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height2: 300 }) }>
            300
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height2: 'auto' }) }>
            auto
          </button>
        </div>
        <AnimateHeight
          height={ height2 }
          duration={ 500 }
          onAnimationEnd={ (params) => { console.log('React Animate Height - animation ended', params); } }
          onAnimationStart={ (params) => { console.log('React Animate Height - animation started', params); } }
          className='demo demo-2'
          animateOpacity
        >
          <div className='demo-content'>
            <p>
              It looked serious, but we in California, like everywhere else, were
              not alarmed. We were sure that the bacteriologists would find a way to
              overcome this new germ, just as they had overcome other germs in the
              past. But the trouble was the astonishing quickness with which this germ
              destroyed human beings, and the fact that it inevitably killed any
              human body it entered. No one ever recovered. There was the old Asiatic
              cholera, when you might eat dinner with a well man in the evening, and
              the next morning, if you got up early enough, you would see him being
              hauled by your window in the death-cart. But this new plague was quicker
              than that&mdash;much quicker.
            </p>
            <input
              className='form-control'
              type='text'
              placeholder='Test for focus'
              onFocus={ () => console.log('Input 2 focused') }
            />
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
              numb first, then the legs, and hips, and when the numbness reached
              as high as his heart he died. They did not rave or sleep. Their minds
              always remained cool and calm up to the moment their heart numbed and
              stopped. And another strange thing was the rapidity of decomposition. No
              sooner was a person dead than the body seemed to fall to pieces, to
              fly apart, to melt away even as you looked at it. That was one of the
              reasons the plague spread so rapidly. All the billions of germs in a
              corpse were so immediately released.
            </p>
          </div>
        </AnimateHeight>

        <h3>Demo, with transition delay</h3>
        <p>
          Here you can see <code>delay</code> prop in action. Parent&apos;s div height is set to 500px.
        </p>
        <p>
          Current Height: <b>{ height3 }</b><br />
          Current Delay: <b>{ delay }</b>
        </p>
        <p>Set delay to:</p>
        <div className='buttons'>
          <button className='btn btn-sm' onClick={ () => this.setState({ delay: 0 }) }>
            0 (default)
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ delay: 300 }) }>
            300
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ delay: 600 }) }>
            600
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ delay: 1000 }) }>
            1000
          </button>
        </div>
        <p className=''>Set height to:</p>
        <div className='buttons'>
          <button className='btn btn-sm' onClick={ () => this.setState({ height3: 0 }) }>
            0
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height3: 100 }) }>
            100
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height3: 200 }) }>
            200
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height3: 300 }) }>
            300
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height3: 'auto' }) }>
            auto
          </button>
          <br />
          <button className='btn btn-sm' onClick={ () => this.setState({ height3: '50%' }) }>
            50% (of the parent height)
          </button>
          <button className='btn btn-sm' onClick={ () => this.setState({ height3: '100%' }) }>
            100% (of the parent height)
          </button>
        </div>
        <div className='demo-3-wrapper'>
          <AnimateHeight
            height={ height3 }
            delay={ delay }
            duration={ 500 }
            className='demo demo-3'
          >
            <div className='demo-content'>
              <p>
                It looked serious, but we in California, like everywhere else, were
                not alarmed. We were sure that the bacteriologists would find a way to
                overcome this new germ, just as they had overcome other germs in the
                past. But the trouble was the astonishing quickness with which this germ
                destroyed human beings, and the fact that it inevitably killed any
                human body it entered. No one ever recovered. There was the old Asiatic
                cholera, when you might eat dinner with a well man in the evening, and
                the next morning, if you got up early enough, you would see him being
                hauled by your window in the death-cart. But this new plague was quicker
                than that&mdash;much quicker.
              </p>
              <input
                className='form-control'
                type='text'
                placeholder='Test for focus'
                onFocus={ () => console.log('Input 2 focused') }
              />
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
                numb first, then the legs, and hips, and when the numbness reached
                as high as his heart he died. They did not rave or sleep. Their minds
                always remained cool and calm up to the moment their heart numbed and
                stopped. And another strange thing was the rapidity of decomposition. No
                sooner was a person dead than the body seemed to fall to pieces, to
                fly apart, to melt away even as you looked at it. That was one of the
                reasons the plague spread so rapidly. All the billions of germs in a
                corpse were so immediately released.
              </p>
            </div>
          </AnimateHeight>
        </div>
      </div>
    );
  }
};

const container = document.getElementById('demo');
const root = createRoot(container);

root.render(<StrictMode><Example /></StrictMode>);

export interface Article {
  slug: string;
  title: string;
  abstract: string;
  content: string;
}

export const articles: Article[] = [
  {
    slug: 'pomodoro-technique',
    title: 'What Is the Pomodoro Technique and How to Use It for Better Focus',
    abstract:
      'A time management strategy that breaks work into short, focused intervals, helping to reduce mental fatigue and make large tasks feel manageable.',
    content: `
        <h2>What is the Pomodoro Technique?</h2>
        <p>
          The Pomodoro Technique is a time management strategy that breaks work
          into short, focused intervals. Traditionally, it&apos;s:
        </p>
        <ul>
          <li>25 minutes of focused work (called a “Pomodoro”)</li>
          <li>5-minute break</li>
          <li>Repeat 4 times, then take a longer 15–30 minute break</li>
        </ul>
        <p>
          This structure helps reduce mental fatigue and makes large tasks feel
          manageable.
        </p>
        <p>
          It was created by Francesco Cirillo in the late 1980s. The name
          “Pomodoro” comes from the tomato-shaped kitchen timer he used.
        </p>

        <h2>Why the Pomodoro Technique Works (Backed by Psychology)</h2>
        <p>
          <strong>1. It reduces procrastination</strong>
        </p>
        <p>
          Committing to just 25 minutes feels much easier than “I need to write
          this whole paper” or “I have to finish this project.” It&apos;s a way
          to trick your brain into starting.
        </p>
        <p>
          <strong>2. It matches your brain’s natural focus rhythms</strong>
        </p>
        <p>
          Studies suggest that our brain can only focus deeply for short bursts
          — often around 20–30 minutes at a time. Pomodoro sessions work with
          this rhythm.
        </p>
        <p>
          <strong>3. It builds momentum</strong>
        </p>
        <p>
          Every completed Pomodoro feels like a small win. That sense of
          progress fuels motivation, especially when you&apos;re tired or
          overwhelmed.
        </p>
        <p>
          <strong>4. It helps manage ADHD and executive dysfunction</strong>
        </p>
        <p>
          People with ADHD often struggle with task initiation, attention
          switching, and time blindness. Pomodoro offers:
        </p>
        <ul>
          <li>A visible, predictable structure</li>
          <li>Built-in breaks (which reduce burnout)</li>
          <li>An external time anchor</li>
        </ul>

        <h2>How to Start Using Pomodoro (No Apps Needed)</h2>
        <p>
          You can literally just use a kitchen timer or a stopwatch app. But if
          you want a cleaner, more focused experience, there are minimalist
          Pomodoro timers that reduce distractions and help you get started
          fast.
        </p>

        <h2>How to use Aika for Pomodoro Technique:</h2>
        <p>
          Aika is a free, web-based Pomodoro timer. Here&apos;s how to set up a
          full session in under a minute:
        </p>
        <ol>
          <li>Set your first 25-minute timer</li>
          <li>
            Add a 5-minute timer using the ➕ icon. This will be your break.
          </li>
          <li>
            Repeat to create 4 Pomodoro/break cycles. For the final timer, set a
            longer break (e.g. 30 minutes).
          </li>
          <li>
            Open the ⚙️ side menu to enable notifications and “Restart timer
            when done.”
          </li>
          <li>
            Press Start. When notified, alternate between focus and rest.
          </li>
        </ol>
        <p>
          That&apos;s it! You’ve set up a complete Pomodoro routine with no
          signup or download.
        </p>

        <h2>Final Thoughts: The Power Is in the Simplicity</h2>
        <p>
          The Pomodoro Technique isn’t flashy and that&apos;s the point. It
          helps you return to the basics of focus: short, intense effort,
          followed by rest.
        </p>
        <p>
          Whether you’re studying, coding, or trying to manage your time better
          with ADHD, Pomodoro can help. Tools like Aika can make it effortless
          to build the habit.
        </p>

        <h2>Frequently Asked Questions</h2>
        <p>
          <strong>How long is a Pomodoro session?</strong>
        </p>
        <p>
          Traditionally, 25 minutes of focused work followed by a 5-minute
          break.
        </p>
        <p>
          <strong>Do I need a special app to use Pomodoro?</strong>
        </p>
        <p>
          No. You can use any timer — though minimalist Pomodoro apps make it
          easier to automate breaks.
        </p>
        <p>
          <strong>Is Pomodoro good for ADHD?</strong>
        </p>
        <p>
          Yes. Its structure helps manage time blindness, overwhelm, and task
          switching.
        </p>
    `,
  },
  {
    slug: 'mastering-pomodoro',
    title: 'Mastering the Pomodoro Technique',
    abstract: 'Placeholder abstract for this article.',
    content: '<p>Placeholder content for this article.</p>',
  },
  {
    slug: '20-20-20-rule',
    title: 'Why Taking Breaks is Crucial for Your Eyes (20-20-20 Rule)',
    abstract: 'Placeholder abstract for this article.',
    content: '<p>Placeholder content for this article.</p>',
  },
  {
    slug: 'story-behind-aika',
    title: 'The Story Behind Aika Timer',
    abstract: 'Placeholder abstract for this article.',
    content: '<p>Placeholder content for this article.</p>',
  },
];

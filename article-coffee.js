(() => {
  document.title = 'The Curious Case of Your 3 PM Coffee — The Explorer’s Table';
  document.querySelector('.hero-kicker').innerHTML = '<span class="line"></span> A DAILY RITUAL, EXAMINED <span class="line"></span>';
  document.querySelector('.hero-title').innerHTML = 'The Curious Case of Your<br>3 PM <em>Coffee</em>';
  document.querySelector('.hero-subtitle').textContent = 'Why the afternoon cup stops working — and what’s actually going on.';
  const meta = document.querySelectorAll('.hero-meta .meta-item');
  if (meta[1]) meta[1].innerHTML = '<i class="fa-regular fa-calendar"></i> The Explorer’s Table — Issue 02';
  if (meta[2]) meta[2].innerHTML = '<i class="fa-solid fa-mug-hot"></i> Energy & Sleep';

  document.getElementById('articleBody').innerHTML = `
    <p class="lede">You know the moment. It is a little after 3 PM, the inbox is winning, and your eyes are starting to feel heavy. You reach for coffee, feel human again for an hour, then hit a wall around 5 PM that somehow feels worse than the tiredness you were trying to fix.</p>
    <p>Here is the plot twist: coffee was never giving you energy in the first place. This is part of The Curious Case of — a series about the daily habits we think we understand, and what is really happening underneath.</p>
    <h2>The math that doesn’t add up</h2>
    <p>Most of us treat coffee like a fuel top-up. Running low? Add more. Still tired? Add more again. But if coffee actually made energy, the second cup would work as well as the first and the afternoon crash would disappear. Instead, it keeps coming.</p>
    <p>That pattern is not a sign that you need better coffee. It is a sign that coffee is doing something quite different from what we assume.</p>
    <h2>Caffeine doesn’t actually wake you up</h2>
    <p>Through the day, a chemical called adenosine slowly builds up in your brain. It is your body’s running-low signal: the more it accumulates, the more tired you feel. Caffeine does not refill the tank. It simply blocks adenosine from landing in the places where your brain would normally receive that message.</p>
    <blockquote><p>You feel alert not because you have more energy, but because you have temporarily muted the part of you that knows you are tired.</p></blockquote>
    <p>The tiredness has not disappeared. It is still building in the background. That is why the same coffee can make you feel switched on now while quietly making the rest of the day harder.</p>
    <h2>It lingers longer than you think</h2>
    <p>Caffeine is slow to leave the body. Its half-life is roughly five to six hours, meaning that if you drink coffee at 3 PM, about half can still be active around 8 or 9 PM. A cup at 4 PM can remain in your system near midnight, even when you no longer feel obviously caffeinated.</p>
    <p>This is why timing matters more than most people realise. Falling asleep easily does not always mean caffeine has stopped interfering with the deeper parts of sleep that help you feel restored the next day.</p>
    <h2>Why the wall shows up</h2>
    <p>While caffeine is holding the door shut, your brain keeps making adenosine. When the caffeine eventually wears off, that backed-up tiredness arrives at once. The crash is not random, and it is not in your head. It often feels worse because the tiredness that would have arrived gradually is now arriving all together.</p>
    <p>That crash invites a second coffee, which can help for a while but leaves caffeine in your system later in the day. Late caffeine can eat into deep sleep; under-rested sleep makes the next day’s tiredness arrive sooner; then the loop begins again.</p>
    <h2>What the Italians understood</h2>
    <p>In Italy, coffee is usually a small espresso, often after a meal, taken standing at a bar and finished in a minute or two. It is a pause and a pleasure, not a line of fuel through a long working day. That intense little espresso often contains less total caffeine than a large mug you nurse at a desk.</p>
    <p>Across much of the Mediterranean, the cup is small, the moment is shared, and then it is done. The point is not to romanticise one culture; it is to notice that a relationship with coffee can be gentler when the drink has a boundary.</p>
    <h2>Chai, kaapi, and the pause</h2>
    <p>India already had its own answer: chai shared in a small glass, or filter kaapi in a steel tumbler. Different drinks, same shape — small, warm, unhurried, social. The break was never just about caffeine. It was a pause you took with people.</p>
    <p>Tea also carries caffeine differently. It naturally contains L-theanine, an amino acid associated with a steadier, calmer form of alertness. A cup of chai may offer a softer lift than a large coffee, along with the simple benefit of stopping for a few minutes.</p>
    <h2>Coffee is not the villain</h2>
    <p>The morning cup earns its place. The difference is in how we use it. Coffee asked to do the job only sleep can do is the version that leaves people wired and then flattened. Real energy comes from rest; coffee only borrows against it.</p>
    <p>Keep the coffee, but make it smaller and earlier. Treat the break as the point. If the afternoon calls for something warm, chai can be on your side. And remember: the tiredness itself is often a sleep problem wearing a coffee costume.</p>
    <p class="closing-line">Use coffee on your own terms — as a pleasure, not a patch.</p>`;
})();

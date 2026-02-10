/**
 * Calculates the freshness degradation curve for a batch of produce.
 * 
 * @param {string} harvestDate - ISO date string of harvest.
 * @param {number} shelfLifeDays - Expected total shelf life in days (default 14 for berries).
 * @param {number} initialScore - Starting health score (default 100).
 * @returns {object} { currentScore, daysRemaining, curveData }
 */
export const calculateFreshness = (harvestDate, shelfLifeDays = 14, initialScore = 100) => {
    const harvestTime = new Date(harvestDate).getTime();
    const currentTime = new Date().getTime();

    // Calculate days passed
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysPassed = Math.max(0, (currentTime - harvestTime) / msPerDay);

    // Generate data points for the graph (from Day 0 to Shelf Life + 2 days cushion)
    const curveData = [];
    const totalPoints = shelfLifeDays + 5; // Show a bit beyond spoilage

    for (let day = 0; day <= totalPoints; day++) {
        // Sigmoid-like decay function: 
        // Fruits stay fresh for a bit, then decay accelerates, then bottoms out.
        // Formula: Score = Initial / (1 + e^(k * (day - midpoint)))
        // Adjusted to start flat and drop.

        let score;
        if (day <= shelfLifeDays * 0.2) {
            // First 20% of shelf life is prime (very slow decay)
            score = initialScore - (day * 0.5);
        } else {
            // Accelerated decay
            const decayRate = 0.15; // steepness
            const midpoint = shelfLifeDays * 0.6;
            // Logistic function modified to drop from 100
            const rawDecay = 100 / (1 + Math.exp(decayRate * (day - midpoint)));
            // Align start to 100 roughly (simplification for UI)
            // Let's use a simpler quadratic model for predictability in this MVP
            // Score = 100 - (100 * (day / shelfLife)^2)

            const ratio = Math.min(day / shelfLifeDays, 1.2); // Cap at 1.2x shelf life
            // Exponential decay: Score = 100 * (1 - ratio^2.5) works well for fruit
            score = Math.max(0, initialScore * (1 - Math.pow(ratio, 2.5)));
        }

        curveData.push({
            day: day,
            score: Math.round(score),
            label: `Day ${day}`
        });
    }

    // Determine current health based on curve
    // Find the point closest to actual days passed
    const currentDayIndex = Math.floor(daysPassed);
    const dayRatio = daysPassed % 1;

    let currentScore = 0;
    if (currentDayIndex < curveData.length - 1) {
        // Interpolate
        const start = curveData[currentDayIndex].score;
        const end = curveData[currentDayIndex + 1].score;
        currentScore = start - ((start - end) * dayRatio);
    } else {
        currentScore = 0;
    }

    const daysRemaining = Math.max(0, Math.ceil(shelfLifeDays - daysPassed));

    // Determine status
    let status = 'Fresh';
    if (currentScore < 40) status = 'Spoiled';
    else if (currentScore < 70) status = 'Consume Soon';

    return {
        currentScore: Math.round(currentScore),
        daysRemaining,
        daysPassed,
        curveData,
        status,
        shelfLifeDays
    };
};

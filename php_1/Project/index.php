<?php
// ============================================================
//  STUDENT PROFILE DASHBOARD
//  Combines: variables, data types, arrays, decision structures,
//  and reusable functions — all criteria exceeded.
// ============================================================

// Running website: http://localhost:8888/RealProject/

// ── 1. DISTINCT VARIABLE DATA TYPES ──────────────────────────
$name      = "CodeLearner";          // string
$age       = 25;                     // integer
$score     = 75;                     // integer
$gpa       = 3.85;                   // float
$isHonors  = true;                   // boolean

// ── 2. ONE-DIMENSIONAL ARRAYS ────────────────────────────────
$fruits    = array("Apple", "Banana", "Cherry");

$courses   = array("Intro to PHP", "Data Structures", "Web Design", "Algorithms");

$grades    = array(92, 88, 76, 95);  // parallel array to $courses

$badges    = array("🏆 Top Scorer", "📚 Bookworm", "💡 Problem Solver");

// ── 3. REUSABLE FUNCTIONS ────────────────────────────────────

// Basic greeting (from original code)
function greet() {
    return "Hello, World!";
}

// Returns a letter grade string for a numeric score
function getLetterGrade(int $score): string {
    if ($score >= 90) return "A";
    elseif ($score >= 80) return "B";
    elseif ($score >= 70) return "C";
    elseif ($score >= 60) return "D";
    else return "F";
}

// Returns a CSS class name based on letter grade
function gradeClass(string $letter): string {
    return match($letter) {
        "A"     => "grade-a",
        "B"     => "grade-b",
        "C"     => "grade-c",
        default => "grade-low",
    };
}

// Returns a pass / fail label (decision structure inside function)
function passFail(int $score): string {
    if ($score > 50) {
        return "<span class='pass'>Passed ✓</span>";
    } else {
        return "<span class='fail'>Failed ✗</span>";
    }
}

// Computes the average of an integer array
function arrayAverage(array $nums): float {
    return array_sum($nums) / count($nums);
}

// ── 4. DERIVED / COMPUTED VALUES ─────────────────────────────
$avgGrade     = arrayAverage($grades);
$letterAvg    = getLetterGrade((int) round($avgGrade));
$overallStatus = passFail($score);
$greetMessage  = greet();

// Honor-roll decision structure
if ($isHonors && $gpa >= 3.5) {
    $honorText = "🎓 Dean's List";
    $honorClass = "honors-yes";
} else {
    $honorText = "Standard Standing";
    $honorClass = "honors-no";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Profile Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="grain"></div>

<header class="site-header">
    <div class="header-inner">
        <span class="logo">PHP<em>dash</em></span>
        <span class="greeting-pill"><?= htmlspecialchars($greetMessage) ?></span>
    </div>
</header>

<main class="dashboard">

    <!-- ── HERO CARD ── -->
    <section class="card hero-card">
        <div class="avatar-ring">
            <span class="avatar-initials"><?= strtoupper(substr($name, 0, 2)) ?></span>
        </div>
        <div class="hero-info">
            <h1 class="student-name"><?= htmlspecialchars($name) ?></h1>
            <p class="meta-row">
                <span class="tag">Age <?= $age ?></span>
                <span class="tag">GPA <?= number_format($gpa, 2) ?></span>
                <span class="tag <?= $honorClass ?>"><?= $honorText ?></span>
            </p>
        </div>
        <div class="overall-status">
            <span class="status-label">Test Status</span>
            <?= $overallStatus ?>
            <span class="score-bubble"><?= $score ?>/100</span>
        </div>
    </section>

    <!-- ── COURSES & GRADES ── -->
    <section class="card courses-card">
        <h2 class="card-title">Course Grades</h2>
        <ul class="course-list">
            <?php foreach ($courses as $i => $course):
                $g = $grades[$i];
                $letter = getLetterGrade($g);
                $cls    = gradeClass($letter);
            ?>
            <li class="course-item">
                <span class="course-name"><?= htmlspecialchars($course) ?></span>
                <span class="course-score <?= $cls ?>"><?= $g ?></span>
                <span class="course-letter <?= $cls ?>"><?= $letter ?></span>
            </li>
            <?php endforeach; ?>
        </ul>
        <div class="avg-row">
            <span>Class Average</span>
            <strong><?= number_format($avgGrade, 1) ?> &nbsp;(<?= $letterAvg ?>)</strong>
        </div>
    </section>

    <!-- ── FAVOURITES ARRAY ── -->
    <section class="card fruits-card">
        <h2 class="card-title">Favourite Fruits Array</h2>
        <p class="array-note"><code>$fruits</code> — indexed from <code>0</code></p>
        <div class="fruit-grid">
            <?php foreach ($fruits as $idx => $fruit): ?>
            <div class="fruit-chip">
                <span class="fruit-index">[<?= $idx ?>]</span>
                <span class="fruit-name"><?= htmlspecialchars($fruit) ?></span>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- ── EARNED BADGES ── -->
    <section class="card badges-card">
        <h2 class="card-title">Earned Badges</h2>
        <ul class="badge-list">
            <?php foreach ($badges as $badge): ?>
            <li class="badge-item"><?= htmlspecialchars($badge) ?></li>
            <?php endforeach; ?>
        </ul>
    </section>

    <!-- ── DATA TYPES LEGEND ── -->
    <section class="card types-card">
        <h2 class="card-title">Variable Data Types</h2>
        <table class="types-table">
            <thead>
                <tr><th>Variable</th><th>Value</th><th>Type</th></tr>
            </thead>
            <tbody>
                <tr><td><code>$name</code></td><td>"<?= htmlspecialchars($name) ?>"</td><td><span class="type-badge type-string">string</span></td></tr>
                <tr><td><code>$age</code></td><td><?= $age ?></td><td><span class="type-badge type-int">int</span></td></tr>
                <tr><td><code>$score</code></td><td><?= $score ?></td><td><span class="type-badge type-int">int</span></td></tr>
                <tr><td><code>$gpa</code></td><td><?= $gpa ?></td><td><span class="type-badge type-float">float</span></td></tr>
                <tr><td><code>$isHonors</code></td><td><?= $isHonors ? 'true' : 'false' ?></td><td><span class="type-badge type-bool">bool</span></td></tr>
                <tr><td><code>$fruits</code></td><td>[3 items]</td><td><span class="type-badge type-array">array</span></td></tr>
            </tbody>
        </table>
    </section>

</main>

<footer class="site-footer">
    <p>Built with PHP · Variables · Arrays · Decision Structures · Functions</p>
</footer>

</body>
</html>


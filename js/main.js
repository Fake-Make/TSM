const DATA = [28.61, 30.1, 33.69, 34.47, 34.64, 34.67, 33.71, 34.29, 34.15, 33.92, 33.93, 33.23, 33.17, 33.02, 32.43, 31.72, 30.85, 29.55, 28.28, 27.61, 27.41, 27.27, 26.65, 25.39, 25.01, 25.26, 25.57, 26.76, 27.88, 27.97, 26.34, 23.63, 21.94, 18.82, 17.5, 16.46, 14.32, 13.04, 12.55, 11.99, 12.14, 12.05, 12, 11.82, 12.25, 12.77, 12.81, 13.1, 13, 13.44, 13.73, 13.87, 13.9, 13.9, 13.85, 13.86, 13.96, 13.6, 13.48, 13.55, 13.51, 13.4, 13.43, 13.44, 13.45, 12.86, 12.93, 12.57, 12.55, 12.88, 13.39, 13.44, 13.84, 14.19, 14.42, 14.74, 14.64, 16.89, 19.29, 23.86, 24.96, 25.58, 25.79, 24.5, 23.53, 23.47, 22.08, 21.54, 20.44, 20.66, 20.67, 21.19, 21.21, 20.82, 20.31, 20.99, 20.92, 21.28, 21.32, 21.38, 21.41, 21.68, 21.42, 21.57, 22.08, 22.58, 22.87, 22.89, 23, 23.01, 23.93, 24.04, 24.29, 24.35, 24.77, 25.66, 26.11, 27.24, 28.02, 28.25, 30.19, 31.49, 32.13, 33.64, 34.78, 36.89, 39.24, 40.34, 41.3, 43.86, 46.05, 45.73, 42.58, 38.2, 32.05, 31.02, 26.86, 22.8, 21.5, 20.69, 19.15, 17.03, 15.85, 15.83, 16.02, 17.11, 18.19, 18.55, 18.7, 19.67, 20.32, 20.44, 21.04, 21.26, 22.12, 22, 22.04, 22.41, 23.07, 23.51, 24.32, 26.87, 28.82, 30.27, 30.07, 31.25, 31.44, 31.06, 30.8, 30.83, 30.95, 30.98, 30.98, 30.78, 30.73, 31.11, 31.02, 31.78, 32.92, 34, 34.85, 35.45, 35.44, 36.99, 36.35, 33.24, 29.32, 27.08, 24.47, 20.43, 19.15, 16.78, 15.62, 17.02, 16.65, 17.21, 18.25, 18.6, 18.64, 19.66, 20.23, 20.99, 22.34, 22.08, 23.42, 23.01, 22.82, 23.29, 23.67, 24.47, 25.17, 24.74, 25.18, 25.46, 25.14, 25.68, 24.12, 24.24, 25.28, 25.43, 24.99, 25, 24.29, 23.37, 22.86, 23.21, 23.86, 24.2, 23.84, 24.23, 28.44, 29.75, 30.21, 29.71, 30.19, 29.22, 27.46, 25.53, 24.01, 20.53, 19, 17.21, 16.19, 15.61, 15.79, 15.87, 16.66, 16.18, 17.38, 17.97, 18.49, 19.22, 19.19, 19.39, 19.23, 19.4, 19.23, 19.4, 19.3, 19.53];
const N = DATA.length;
const DATA_X = Array.from(Array(N).keys());
const DATA_SORTED = DATA.slice(0).sort();
const mathExpectation = data => data.reduce((acc, curr) => acc + curr) / N;
const dispersion = DATA.reduce((acc, curr) => acc + Math.pow((curr - mathExpectation), 2)) / (N - 1);
const quantile = -0.74;
const chiSquaredAt095 = [0.00393, 0.103, 0.352, 0.711, 1.145, 1.635, 2.167, 2.733, 3.325, 3.940];

var drawPlot = (name, data, caption) => {
	var plot = document.getElementById('plot-' + name);
	var layout = {
		title: caption ? caption : 'Plot of ' +  name,
		margin: {
			t: 30,
			b: 20,
			l: 25
		}
	};
	Plotly.newPlot(plot, data, layout);
}

function slicePerYear(sourceArray) {
	const firstYear = 2011;
	const weeksAtYear = 51;
	let sourceArray_X = Array.from(Array(sourceArray.length).keys());
	var destArray = [];

	var fullYears = Math.floor(N / weeksAtYear);
	let year = 0;
	for(; year < fullYears; year++) {
		destArray.push({
			x: sourceArray_X.slice(year * weeksAtYear, (year + 1) * weeksAtYear + 1),
			y: sourceArray.slice(year * weeksAtYear, (year + 1) * weeksAtYear + 1),
			mode: 'lines',
			name: firstYear + year
		});
	}
	if (N % weeksAtYear) {
		destArray.push({
			x: sourceArray_X.slice(year * weeksAtYear),
			y: sourceArray.slice(year * weeksAtYear),
			mode: 'lines',
			name: firstYear + year
		});
	}
	return destArray;
}

{	// Auto-corellation, trend, season, leftover
	var trendFunction = t => 3e-4 * Math.pow(t + 1, 2) - 0.0425 * (t + 1) + 27.872;
	var autoCovariance = (data, index) => {
		let sum = 0;
		for (let i = 0; i < data.length - index; i++) {
			sum += (data[i] - mathExpectation(data)) * (data[i + index] - mathExpectation(data));
		}
		return sum / (data.length - index);
	}
	var autoCorellation = (data, t) => autoCovariance(data, t) / autoCovariance(data, 0);

	{	// Season
		// Get correction of trend
		var seasonLine = DATA.map((val, t) => val - trendFunction(t));
		// Get average per week
		var period = slicePerYear(seasonLine);
		var seasons = period[0].y.length;
		var periods = period.length;
		let i = 0;
		// Notice last period with just a few seasons
		for (; i < period[periods - 1].y.length; i++) {
			seasonLine[i] = period.reduce((acc, cur) => acc + cur.y[i], 0) / periods;
		}
		for (; i < seasons; i++) {
			seasonLine[i] = period.reduce((acc, cur) => acc + (cur.y[i] || 0), 0) / (periods - 1);
		}
		// Get shift from zero-sum
		let shift = seasonLine.slice(0, seasons + 1).reduce((acc, cur) => acc + cur) / seasons;
		for (i = 0; i < seasons; seasonLine[i++] -= shift);
		// Repeat for left of seasons around whole periods
		var seasonFunction = i => seasonLine[i % seasons];
	}

	var leftover = DATA.map((price, t) => price - trendFunction(t) - seasonFunction(t));
}

function statisticsBoxPierce(p, leftovers) {
	let r = (j, e) => {
		let N = e.length;
		let numerator = 0;
		let denomenator = 1;

		for (let t = j + 1; t < N; t++)
			numerator += e[t] * e[t - j];
		for (let t = 1; t < N; t++)
			denomenator += Math.pow(e[t], 2);

		return numerator / denomenator;
	};

	let sum = 0;
	for (let j = 0; j < p; j++) {
		let rRes = r(j, leftovers);

		sum += Math.pow(rRes, 2);
	}

	return N * sum;
}

particialAutoCorrelation1 = (e) => {
	let arr = [];
	for (let i = 1; i < e.length; i++) {
		let rPrevSquared = Math.pow(autoCorellation(e, i - 1), 2);
		arr[i - 1] = autoCorellation(e, i) - rPrevSquared;
		arr[i - 1] /= 1 - rPrevSquared;
	}
	return arr;
}

{	// AR(1) model, DF condition
	var teta = optimjs.minimize_Powell(v => leftover.reduce((acc, cur, t) => t ? acc + Math.pow(v[0] * leftover[t - 1] - cur, 2) : cur), [.8]).argument[0];;
	var newLeftover = leftover.map((item, t) => t ? leftover[t - 1] * teta : item);
	$('.teta').html(teta.toFixed(3));

	let statisticsStudent = leftover[0] / Math.sqrt(leftover.reduce((acc, cur) => acc + Math.pow(cur, 2)) / leftover.length);
	let stat = (teta - 1) / statisticsStudent;
	let crit = -2.58;

	var dfAccept = stat < crit;
	let str = `t = ${stat.toFixed(4)} ${dfAccept ? '<' : '>'} DF<sub>α</sub>(α, N) = ${crit}`;
	$('.df-condition').html(str);
	$('.df-accept').html(dfAccept ? 'принимается' : 'отвергается');
	$('.df-station').html(dfAccept ? 'стационарен' : 'не стационарен');
}

if (!dfAccept) {
	let k, accept = true, str = '<p>Далее необходимо перейти к поиску порядка интегрирования ряда остатков. Для этого воспользуемся критерием Бокса-Пирса для гипотезы об отсутствии автокорреляции до порядка <span class="math">p</span>.</p><p>Для проверки этой гипотезы используется статистика Бокса-Пирса, имеющая вид: <span class="math">Q = N * sum of (r<sup>2</sup>(j)) from j = 1 to p</span>. Гипотеза отвергается, если <span class="math">Q > χ<sup>2</sup><sub>кр</sub>(1 - α, p)</span>.</p>';
	for(k = 0; k < 5 && accept; k++) {
		let stat = statisticsBoxPierce(k, leftover);
		let crit = chiSquaredAt095[k];
	
		accept = stat < crit;
		let acceptText = accept ? 'принимается' : 'отвергается';
		str += `<p>Статистика Бокса-Пирса для <span class="math">k = ${k + 1}: ${stat.toFixed(4)}</span>. Критическое значение <span class="math">χ<sup>2</sup>(0.95, ${k + 1}) = ${crit}</span>.`;
		str += ` Гипотеза об отсутствии автокорреляции до порядка p = <span class="math">${k + 1} ${acceptText}</span>.</p>`;
	}
	str += `<p>Соответственно, порядок интегрирования <span class="math">k = ${k - 1}</span>.</p>`;
	$('.df-inspection').after(str);
}

console.log(leftover.reduce((acc, cur) => acc += `\n${cur}`));

{	// ARIMA building
	// 0.4166 0.2620,-0.0508
	var arima = [];
	for(let t = 0; t < leftover.length; t++) {
		arima[t] = t > 2 ?
		-0.0537 + 0.3286 * (leftover[t - 1] - leftover[t - 2]) + 0.1733 * (leftover[t - 2] - leftover[t - 3]) + leftover[t - 1] :
		leftover[t];
	}
}

{	// AR(1) model, DF condition
	var arimaLeftover = arima.map((item, t) => leftover[t] - item);
	var teta = optimjs.minimize_Powell(v => arimaLeftover.reduce((acc, cur, t) => t ? acc + Math.pow(v[0] * arimaLeftover[t - 1] - cur, 2) : cur), [.8]).argument[0];
	var newArimaLeftover = arimaLeftover.map((item, t) => t ? arimaLeftover[t - 1] * teta : item);
	// $('.teta').html(teta.toFixed(3));

	let statisticsStudent = -arimaLeftover[3] / 4 / Math.sqrt(arimaLeftover.reduce((acc, cur) => acc + Math.pow(cur, 2)) / arimaLeftover.length);
	console.log(arimaLeftover[3], Math.sqrt(arimaLeftover.reduce((acc, cur) => acc + Math.pow(cur, 2)) / arimaLeftover.length))
	let stat = (teta - 1) / statisticsStudent;
	let crit = -2.58;

	var dfAccept = stat < crit;
	let str = `t = ${stat.toFixed(4)} ${dfAccept ? '<' : '>'} DF<sub>α</sub>(α, N) = ${crit}`;
	$('.arima-df-condition').html(str);
	$('.arima-df-accept').html(dfAccept ? 'принимается' : 'отвергается');
	$('.arima-df-station').html(dfAccept ? 'стационарен' : 'не стационарен');
}

drawPlot('leftover', [{x: DATA_X, y: leftover}], 'Ряд остатков');
drawPlot('ar_model', [{x: DATA_X, y: leftover, name: 'Остатки'}, {x: DATA_X, y: newLeftover, name: 'AR(1)'}], 'AR(1) модель');
drawPlot('arima', [{x: DATA_X, y: leftover, name: 'Остатки'}, {x: DATA_X, y: arima, name: 'ARIMA-модель'}], 'ARIMA-модель и ряд остатков');
drawPlot('arima_df', [{x: DATA_X, y: arimaLeftover, name: 'Остатки после ARIMA-модели'}, {x: DATA_X, y: newArimaLeftover, name: 'AR(1) остатков после ARIMA-модели'}], 'Ряд остатков после ARIMA-модели');
drawPlot('basic', [{x: DATA_X, y: DATA, name: 'Исходный ряд'}, {x: DATA_X, y: DATA.map((_, t) => trendFunction(t) + seasonFunction(t) + arima[t]), name: 'Итоговая модель'}, {x: DATA_X, y: DATA.map((_, t) => trendFunction(t) + seasonFunction(t)), name: 'Модель без ARIMA'}], 'Модель в терминах исходного ряда');
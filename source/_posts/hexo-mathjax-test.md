---
title: hexo+mathjax生成公式测试
date: 2016-02-19 16:04:15
tags: [latex, hexo-math, mathjax, algo]
categories: other
---

### 公式书写注意 ###
1. 下标要用转义字符，\\\_，因为在markdown里面被两个_包围起来的字符会最终被编译成&lt;em&gt;xxx&lt;\/em&gt;


### 举例 ###
```bash
$$\frac{\partial u}{\partial t}
= h^2 \left( \frac{\partial^2 u}{\partial x^2} +
\frac{\partial^2 u}{\partial y^2} +
\frac{\partial^2 u}{\partial z^2}\right)$$
```
$$\frac{\partial u}{\partial t}
= h^2 \left( \frac{\partial^2 u}{\partial x^2} +
\frac{\partial^2 u}{\partial y^2} +
\frac{\partial^2 u}{\partial z^2}\right)$$

```bash
$$
\mathcal{L}(x,\beta) = \sum_{i=1}^{m} \mathcal{L}\_i(x\_i, \beta) = \sum_{i=1}^{m} \left(f\_i(x\_i) + \beta^T A\_i x\_i - \frac{1}{N} \beta^T b \right)
\qquad(1.7)
$$
```

$$
\mathcal{L}(x,\beta) = \sum_{i=1}^{m} \mathcal{L}\_i(x\_i, \beta) = \sum_{i=1}^{m} \left(f\_i(x\_i) + \beta^T A\_i x\_i - \frac{1}{N} \beta^T b \right)
\qquad(1.7)
$$

```bash
$$
\begin{align}
& \min_{x} \quad f(x) \\\\
& s.t. \; Ax=b
\end{align}  \qquad(1.1)
$$
```
$$
\begin{align}
& \min_{x} \quad f(x) \\\\
& s.t. \; Ax=b
\end{align}  \qquad(1.1)
$$

```bash
$$
    \mathcal{L}(x,\beta) = f(x) + \beta^T (Ax-b) \qquad(1.2)
$$
```
$$
    \mathcal{L}(x,\beta) = f(x) + \beta^T (Ax-b) \qquad(1.2)
$$
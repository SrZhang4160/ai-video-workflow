# 2026-10-26 Rust 第一课：cargo 和第一个项目

## 今天学了什么
- rustup 管 Rust 版本，cargo 管项目：建项目、装依赖、编译、运行都靠它。
- 一个项目就两样核心东西：`Cargo.toml`（说明书和依赖）和 `src/main.rs`（入口）。
- `cargo check` 只检查不生成程序，比 `cargo build` 快，写代码时最常用。
- `println!` 带感叹号，因为它是宏，不是函数。

## 踩的坑
第一次 `cargo run` 很慢，以为卡住了，其实是在下载和编译依赖，第二次就快了。

## 和我背景的联系
以前做机器人用 ROS，要 catkin/colcon 编译、pip 装 Python 包、CMake 写构建脚本。Rust 里 cargo 一个工具全包了，体验好很多。

## 想讲给别人的一句话
学 Rust 的第一天不用急着学语法，先把 cargo 的四个命令用熟：check、build、run、build --release。

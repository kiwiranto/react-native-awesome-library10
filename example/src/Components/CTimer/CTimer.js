import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class CTimer extends Component {
	state = {
		hours: 0,
		minutes: 0,
		seconds: 0
	}

	componentDidMount() {
		const { time } = this.props;

		this.setState({
			hours: parseInt(time / 3600),
			minutes: parseInt((time % 3600) / 60),
			seconds: time % 60
		});

		this.myInterval = setInterval(() => {
			const { hours, seconds, minutes } = this.state;

			if (seconds > 0) {
				this.setState(({ seconds }) => ({
					seconds: seconds - 1
				}));
				if (this.props.onChange) {
					this.props.onChange(seconds);
				}
			}
			if (seconds === 0) {
				if (minutes === 0) {
					if (hours === 0) {
						clearInterval(this.myInterval);
						if (this.props.onFinished) {
							this.props.onFinished();
						}
					} else {
						this.setState(({ hours }) => ({
							hours: hours - 1,
							minutes: 59,
							seconds: 59
						}));
					}
				} else {
					this.setState(({ minutes }) => ({
						minutes: minutes - 1,
						seconds: 59
					}));
				}
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.myInterval);
	}

	componentDidUpdate(prevProps) {
		if(this.props.stopTimer !== prevProps.stopTimer) {
			if(this.props.stopTimer) {
				clearInterval(this.myInterval);
			}
		}
	}

	render() {
		/**
		 * props value :
		 * props.color {string}: color value
		 * props.size {number}: size text
		 * props.bracket {boolean}: visible or not
		 * props.type {object}, example:
		 * 	{
				hours: true,
				minutes: true,
				seconds: true
			}		
		 */
		const { color, type, size, bracket, containerStyle } = this.props;
		const { hours, minutes, seconds } = this.state;

		return (
			<View style={{ ...styles.containerTimer, ...containerStyle }}>
				{bracket &&
					<Text style={{ ...styles.timerText, color: color, fontSize: size }}>(</Text>
				}

				{type?.hours &&
					<Text style={{ ...styles.timerText, color: color, fontSize: size }}>
						{hours < 10 ? `0${hours}` : hours}{':'} 
					</Text>
				}

				{type?.minutes &&
					<Text style={{ ...styles.timerText, color: color, fontSize: size }}>
						{minutes < 10 ? `0${minutes}` : minutes}{':'} 
					</Text>
				}

				{type?.seconds &&
					<Text style={{ ...styles.timerText, color: color, fontSize: size }}>
						{seconds < 10 ? `0${seconds}` : seconds}
					</Text>
				}

				{bracket &&
					<Text style={{ ...styles.timerText, color: color, fontSize: size }}>)</Text>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	containerTimer: {
		flexDirection: 'row'
	},
	timerText: {
		fontFamily: 'Muli-Bold',
		fontSize: 14,
		textAlign: 'center',
		color: '#ff4c47'
	}
});
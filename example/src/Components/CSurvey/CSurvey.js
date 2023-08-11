import React, { Component } from 'react'
import { View, SafeAreaView, ScrollView, Text, TextInput, Modal, Image, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { iconSurvey, iconClose, iconCheck, iconExclamationLarge } from '../../Assets/app/shared';
import { dpi } from '../../Helper/HelperGlobal';
import LinearGradient from 'react-native-linear-gradient';
import CText from '../CText';;
import CButton from '../CButton.mobile';
import PopupResultSubmit from './PopupResultSubmit';
import { submitSurveyNPS } from './action';

class CSurvey extends Component {
	state = {
		isLoading: false,
		isVoting: false,
		surveyRating: [],
		ratingSelected: 0,
		ratingSelectedFormatted: "",
		titleFeedback: "",
		multipleChoiceFeedback: [],
		multipleChoiceFeedbackSelected: [],
		answerIdFreeText: "",
		freeTextFeedback: "",
		isSuccess: false,
		isFailed: false
	}

	componentDidMount() {
		this._renderRating()
		this._renderMultipleChoiceFeedback()
	}

	_renderRating = () => {
		const { surveyData } = this.props

		try {
			const ratingScale = surveyData.surveyQuestion.filter(item => { return item.answer_type == "rating_scale" })[0]
			const arrRating = ratingScale.answers.filter((item, index) => { return index !== 0 }).map(item => {
				item = { ...item, is_selected: false }
				return item
			})

			this.setState({
				surveyRating: arrRating
			})
		} catch (error) {
			console.log(error);

			this.setState({
				surveyRating: []
			})
		}
	}

	_renderMultipleChoiceFeedback = () => {
		const { surveyData } = this.props

		try {
			const multipleChoice = surveyData.surveyQuestion.filter(item => { return item.answer_type == "multiple_choice" })[0]
			const multipleChoiceFeedback = multipleChoice.answers.filter((item, index) => { return index !== 6 }).map(item => {
				item = { ...item, is_selected: false }
				return item
			})

			this.setState({
				multipleChoiceFeedback: multipleChoiceFeedback,
				answerIdFreeText: surveyData.surveyQuestion.filter((item) => { return item.answer_type === "free_text" })[0].answer_id
			})
		} catch (error) {
			console.log(error);

			this.setState({
				multipleChoiceFeedback: []
			})
		}
	}

	_handleSelectRating = (selectedRating) => {
		const { language, surveyData } = this.props
		const answerId = surveyData.surveyQuestion.filter(item => { return item.answer_type == "rating_scale" })[0].answer_id
		const answerFormated = answerId + "~" + selectedRating.answer_value

		let newRating = this.state.surveyRating.map(item => {
			return {
				...item,
				is_selected: (item.answer_value === selectedRating.answer_value) ? item.is_selected = true : item.is_selected = false
			}
		})

		this.setState({
			isVoting: true,
			surveyRating: newRating,
			ratingSelected: parseInt(selectedRating.answer_value),
			titleFeedback: language == "en" ? selectedRating.answer_text_en : selectedRating.answer_text_ind,
			ratingSelectedFormatted: answerFormated
		})
	}

	_handleSelectMultipleChoiceFeedback = (itemSelected) => {
		const { surveyData } = this.props
		const answerId = surveyData.surveyQuestion.filter(item => { return item.answer_type == "multiple_choice" })[0].answer_id
		const answerFormated = itemSelected.answer_id + "~" + itemSelected.answer_value
		let multipleChoiceSelected = this.state.multipleChoiceFeedbackSelected
		let indexSelected = multipleChoiceSelected.indexOf(answerFormated)
		let isDuplicate = indexSelected !== -1 ? true : false;

		if (!isDuplicate) {
			multipleChoiceSelected.push(answerFormated)
		} else {
			multipleChoiceSelected.splice(indexSelected, 1)
		}

		let newAdditionalFeedback = this.state.multipleChoiceFeedback.map(item => {
			return {
				...item,
				is_selected: (item.answer_value === itemSelected.answer_value) ? !item.is_selected : item.is_selected
			}
		})

		this.setState({
			multipleChoiceFeedback: newAdditionalFeedback,
			multipleChoiceFeedbackSelected: multipleChoiceSelected
		})
	}

	_handleSubmitSurvey = async () => {
		this.setState({ isLoading: true })
		const { accessTokenData, surveyData } = this.props
		const { ratingSelectedFormatted, multipleChoiceFeedbackSelected, answerIdFreeText, freeTextFeedback } = this.state

		const dataParams = {
			id: surveyData.surveyId,
			score: freeTextFeedback.length !== 0
				? [ratingSelectedFormatted, ...multipleChoiceFeedbackSelected, answerIdFreeText + "~" + freeTextFeedback]
				: [ratingSelectedFormatted, ...multipleChoiceFeedbackSelected]
		}

		try {
			let result = await submitSurveyNPS(accessTokenData.accessToken, dataParams)
			console.log("RESULT SUBMIT: ", result);

			if (result.data.code == "SURVEYSUBMIT00") {
				this.setState({
					isLoading: false,
					isSuccess: true
				})
			} else {
				this.setState({
					isLoading: false,
					isFailed: true
				})
			}
		} catch (error) {
			console.log("Error Submit Survey", error);
			this.setState({
				isLoading: false,
				isFailed: true
			})
		}
	}

	_renderContent = () => {
		const { isVoting, surveyRating, ratingSelected, titleFeedback, multipleChoiceFeedback, isSuccess, isFailed } = this.state
		const { surveyVisible, title, subtitle, surveyImage, surveyButtonText, onCloseModal, language, t } = this.props;
		const surveyImg = surveyImage ? surveyImage : iconSurvey
		const buttonText = surveyButtonText ? surveyButtonText : t("CSurvey.ButtonAction")

		if (isSuccess) {
			return (
				<PopupResultSubmit
					iconResult={iconCheck}
					title={t("CSurvey.SuccessSubmit.Title")}
					subtitle={t("CSurvey.SuccessSubmit.Subtitle")}
					buttonText={t("CSurvey.SuccessSubmit.ButtonAction")}
					handleButtonOnPress={onCloseModal}
					ratingScore={ratingSelected}
					isSuccess={isSuccess}
					t={t}
				/>
			)
		}

		if (isFailed) {
			return (
				<PopupResultSubmit
					iconResult={iconExclamationLarge}
					title={t("CSurvey.FailedSubmit.Title")}
					subtitle={t("CSurvey.FailedSubmit.Subtitle")}
					buttonText={t("CSurvey.FailedSubmit.ButtonAction")}
					handleButtonOnPress={() => this.setState({ isFailed: false })}
					isSuccess={isSuccess}
					t={t}
				/>
			)
		}

		return (
			<View style={!isVoting ? styles.scoreSection : { ...styles.scoreSection, flex: 1, maxHeight: "100%" }}>
				<KeyboardAvoidingView
					behavior={Platform.OS == "ios" && "padding"}
					style={{ flex: 1 }}
				>
					<ScrollView contentContainerStyle={{ ...styles.contentSpacing, flexGrow: 1, justifyContent: "space-between" }}>
						<View style={{ alignItems: "center" }}>
							<Image
								source={surveyImg}
								style={styles.surveyImage}
							/>

							<Text style={styles.surveyTitle}>{title}</Text>
							<Text style={styles.surveySubtitle}>{subtitle}</Text>

							<View style={styles.scoreWrapper}>
								<LinearGradient
									colors={['#ffd6a2', '#ff343a']}
									start={{ x: 1.1, y: 0 }} end={{ x: 0, y: 0 }}
									style={styles.surveyScoreBorder}
								>
									<View style={styles.surveyScore}>
										{surveyRating && surveyRating.map(item => {
											return (
												<TouchableOpacity
													style={styles.surveyScoreButton}
													onPress={() => this._handleSelectRating(item)}
												>
													{item.is_selected
														? (
															<LinearGradient
																colors={['#ffd6a2', '#ff343a']}
																start={{ x: 1.0, y: 0.0 }} end={{ x: 0.0, y: 0.5 }}
																style={styles.surveyScoreButton}
															>
																<Text style={styles.textWhite}>{item.answer_value}</Text>
															</LinearGradient>
														)
														: (
															<Text style={styles.textGrey}>{item.answer_value}</Text>
														)
													}
												</TouchableOpacity>
											)
										})}
									</View>
								</LinearGradient>

								<View style={styles.scoreIndicator}>
									<CText style={styles.scoreIndicatorText}>
										{t("CSurvey.IndicatorNegative")}
									</CText>
									<CText style={styles.scoreIndicatorText}>
										{t("CSurvey.IndicatorPositive")}
									</CText>
								</View>
							</View>

							{isVoting && (
								<View>
									<CText style={styles.multipleChoiceFeedbackTitle}>
										{titleFeedback}
									</CText>

									<View style={styles.feedbackList}>
										{multipleChoiceFeedback && multipleChoiceFeedback.map(item => {
											return (
												<TouchableOpacity
													style={item.is_selected ? styles.feedbackItemActive : styles.feedbackItem}
													onPress={() => this._handleSelectMultipleChoiceFeedback(item)}
												>
													<CText style={item.is_selected ? styles.feedbackItemTextActive : styles.feedbackItemText} bold={true}>
														{language == "en" ? item.answer_text_en : item.answer_text_ind}
													</CText>
												</TouchableOpacity>
											)
										})}
									</View>

									<ScrollView style={styles.textInputSurvey}>
										<TextInput
											multiline={true}
											numberOfLines={3}
											scrollEnabled={true}
											onChangeText={text => this.setState({ freeTextFeedback: text })}
											value={this.state.freeTextFeedback}
											placeholder={t("CSurvey.TextInputPlaceholder")}
											style={styles.textArea}
										/>
									</ScrollView>
								</View>
							)}
						</View>

						{isVoting && (
							<CButton
								styleWrapper={{
									marginHorizontal: 0,
									marginTop: dpi(15)
								}}
								styleProp={{
									borderRadius: dpi(10),
									height: dpi(20)
								}}
								styleBtn={{ fontSize: 16 }}
								txtColor={"#fff"}
								bold={true}
								background={"#ff4c47"}
								label={buttonText}
								onPress={() => this._handleSubmitSurvey()}
							/>
						)}
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		)
	}

	render() {
		const { isLoading, isVoting } = this.state
		const { surveyVisible, onCloseModal } = this.props;

		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={surveyVisible}
			>
				<View style={styles.modalBackground}>
					<SafeAreaView style={isVoting ? styles.surveyContentFull : styles.surveyContent}>
						{isLoading && (
							<View style={styles.loaderMask}>
								<View style={styles.loaderContainer}>
									<ActivityIndicator size={50} color="#ff4c47" />
								</View>
							</View>
						)}

						<View style={styles.iconClose}>
							<TouchableOpacity onPress={onCloseModal}>
								<Image
									source={iconClose}
									style={{ width: dpi(12), height: dpi(12) }}
								/>
							</TouchableOpacity>
						</View>

						{this._renderContent()}
					</SafeAreaView>
				</View>
			</Modal>
		)
	}
}

export default CSurvey

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, .7)"
	},
	surveyContent: {
		backgroundColor: "white",
		borderTopLeftRadius: dpi(8),
		borderTopRightRadius: dpi(8),
		alignItems: "center"
	},
	surveyContentFull: {
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		alignSelf: "stretch"
	},
	contentSpacing: {
		paddingHorizontal: dpi(4),
		paddingVertical: dpi(12)
	},
	scoreSection: {
		justifyContent: "space-between",
		maxHeight: dpi(178)
	},
	iconClose: {
		position: "absolute",
		top: dpi(8),
		right: dpi(8),
		zIndex: 2
	},
	surveyImage: {
		width: dpi(32),
		height: dpi(32),
		marginVertical: dpi(8)
	},
	surveyTitle: {
		textAlign: "center",
		fontFamily: "Muli-Bold",
		fontSize: dpi(10),
		color: "#1a1a1a",
		marginBottom: dpi(4)
	},
	surveySubtitle: {
		fontFamily: "Muli-Regular",
		fontSize: dpi(8),
		textAlign: "center",
		color: "#1a1a1a",
		lineHeight: dpi(12)
	},
	surveyButton: {
		backgroundColor: "#ff4c47",
		borderRadius: 20,
		elevation: 2,
		paddingHorizontal: dpi(12),
		paddingVertical: dpi(5),
		marginTop: dpi(14),
		alignSelf: 'stretch'
	},
	surveyButtonText: {
		color: "#fff",
		fontFamily: "Muli-Bold",
		textAlign: "center",
		fontSize: 16
	},
	scoreWrapper: {
		marginTop: dpi(20),
		marginBottom: dpi(16)
	},
	surveyScoreBorder: {
		borderRadius: dpi(12),
		padding: 1
	},
	surveyScore: {
		flexDirection: "row",
		borderRadius: dpi(10),
		backgroundColor: "#fff",
		padding: dpi(2)
	},
	surveyScoreButton: {
		width: dpi(16),
		height: dpi(16),
		borderRadius: dpi(12),
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 1
	},
	textGrey: {
		color: "#646464"
	},
	textWhite: {
		color: "#fff"
	},
	scoreIndicator: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: dpi(4),
		marginHorizontal: dpi(4)
	},
	scoreIndicatorText: {
		fontSize: dpi(5)
	},
	multipleChoiceFeedbackTitle: {
		fontSize: dpi(8),
		marginBottom: dpi(8),
		textAlign: "center"
	},
	feedbackList: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around"
	},
	feedbackItem: {
		borderColor: "#b0b0b0",
		borderWidth: 1,
		borderRadius: dpi(10),
		width: dpi(82),
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: dpi(2),
		paddingHorizontal: dpi(2),
		marginBottom: dpi(8)
	},
	feedbackItemActive: {
		borderColor: "#ff4c47",
		borderWidth: 1,
		borderRadius: dpi(10),
		width: dpi(82),
		justifyContent: "center",
		alignItems: "center",
		padding: dpi(2),
		marginBottom: dpi(8)
	},
	feedbackItemText: {
		fontSize: dpi(6),
		color: "#646464",
		lineHeight: dpi(12)
	},
	feedbackItemTextActive: {
		fontSize: dpi(6),
		color: "#1a1a1a",
		lineHeight: dpi(12)
	},
	textInputSurvey: {
		borderColor: "#b0b0b0",
		borderWidth: 1,
		borderRadius: dpi(6),
		maxHeight: dpi(36),
		marginTop: dpi(4)
	},
	textArea: {
		flex: 1,
		textAlignVertical: "top",
		paddingHorizontal: dpi(8),
		fontSize: dpi(7),
		fontFamily: "Muli-Regular"
	},
	loaderMask: {
		flex: 1,
		justifyContent: 'center',
		alignItems: "center",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 9999,
		backgroundColor: "rgba(255,255,255,0.75)"
	},
	loaderContainer: {
		width: 70,
		height: 70,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 35,
		backgroundColor: "#fff",
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.15,
		shadowRadius: 5,
	}
})

# 显式行业 profile

通用规划器保持行业中立。未填 `meta.industry_profile` 时采用 `generic`，不会从客户名、旧对话、offline 的行业字段或样例自动推断。通用声明涉及实际相关的产品/服务、提供方、许可、日期、价格、资格与效果；修理业务不会被要求提供教学或考试资质。

只有明确建立教育行业背景，才设置 `meta.industry_profile: "education"`。此时[profile 数据](industry-profiles.json)中的提示仅针对实际相关的声明：课程、教师、考试路径或考点各有证据；未提供相应服务则记 N/A。教育机构并非都必须提供考试或具备考点身份，未知公开声明继续暂扣。

`course`、`instructor`、`exam_eligibility`、`test_center` 是教育专用类型；未启用 profile 时返回 `INDUSTRY_PROFILE_REQUIRED`，不会静默丢弃或转成通用声明。其他行业可以使用通用 `offer`、`provider`、`authorization`、`eligibility` 类型。未来增加行业须有明确范围和测试，不扩大默认提示。

## 虚构片段示例——不是完整计划

以下仅为虚构学习工作坊的接口片段，不对应真实机构、考试日期、资质或客户记录。只将适用声明放入已补齐的计划，使用实际获准来源 ID。

```json
{
  "meta": { "industry_profile": "education" },
  "evidence_requirements": [
    { "claim": "所宣传工作坊内容及学习者适配尚缺证据", "kind": "course", "state": "tbc", "source_ids": ["S-UNKNOWN"], "public_action": "hold" },
    { "claim": "如使用教师资质声明，需要对应证据", "kind": "instructor", "state": "tbc", "source_ids": ["S-UNKNOWN"], "public_action": "hold" }
  ]
}
```

调用路径：`preparePlan` 补通用默认；`validatePlan` 限定专用声明类型并检查公开声明证据；`buildReport` 只读取已选 profile 的提示/检查项。通用 schema 只存中立类型标识，profile 数据定义词汇；语义校验拒绝未知类型并落实适用性。这些控制不代做研究，也不认证资格。
